import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSiteData } from '../hooks/useSiteData';
import { supabase } from '../lib/supabase';
import '../styles/admin.css';

// Platform presets for the dropdown
const platformPresets = [
    { value: 'whatsapp', label: 'WhatsApp', icon: 'fa-brands fa-whatsapp', placeholder: '+91 9343407099' },
    { value: 'instagram', label: 'Instagram', icon: 'fa-brands fa-instagram', placeholder: '@nandani_graphicano' },
    { value: 'email', label: 'Email', icon: 'fa-regular fa-envelope', placeholder: 'hello@example.com' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'fa-brands fa-linkedin-in', placeholder: 'https://linkedin.com/in/...' },
    { value: 'behance', label: 'Behance', icon: 'fa-brands fa-behance', placeholder: 'https://behance.net/...' },
    { value: 'dribbble', label: 'Dribbble', icon: 'fa-brands fa-dribbble', placeholder: 'https://dribbble.com/...' },
    { value: 'youtube', label: 'YouTube', icon: 'fa-brands fa-youtube', placeholder: 'https://youtube.com/@...' },
    { value: 'twitter', label: 'X / Twitter', icon: 'fa-brands fa-x-twitter', placeholder: '@handle' },
    { value: 'facebook', label: 'Facebook', icon: 'fa-brands fa-facebook-f', placeholder: 'https://facebook.com/...' },
    { value: 'phone', label: 'Phone', icon: 'fa-solid fa-phone', placeholder: '+91 ...' },
    { value: 'website', label: 'Website', icon: 'fa-solid fa-globe', placeholder: 'https://...' },
    { value: 'custom', label: 'Custom', icon: 'fa-solid fa-link', placeholder: 'Enter value...' },
];

export default function Admin() {
    const { user, loading, signOut } = useAuth();
    const { data: siteData, updateData, loading: dataLoading } = useSiteData();
    const navigate = useNavigate();
    
    const [activeTab, setActiveTab] = useState('hero');
    const [messages, setMessages] = useState([]);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // Creative Admin Cursor
    const cursorRef = useRef(null);
    const cursorRingRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const ring = cursorRingRef.current;
        if (!cursor || !ring) return;

        const moveCursor = (e) => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            ring.animate(
                { left: `${e.clientX}px`, top: `${e.clientY}px` },
                { duration: 400, fill: 'forwards' }
            );
        };

        const grow = () => { ring.style.width = '50px'; ring.style.height = '50px'; ring.style.borderColor = 'var(--accent)'; };
        const shrink = () => { ring.style.width = '35px'; ring.style.height = '35px'; ring.style.borderColor = 'rgba(var(--accent-rgb), 0.4)'; };

        document.addEventListener('mousemove', moveCursor);
        document.querySelectorAll('a, button, input, textarea, select, .admin-card').forEach(el => {
            el.addEventListener('mouseenter', grow);
            el.addEventListener('mouseleave', shrink);
        });

        return () => {
            document.removeEventListener('mousemove', moveCursor);
        };
    });

    const loadMessages = async () => {
        const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
        setMessages(data || []);
    };

    const loadAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            const { data, error } = await supabase.from('page_analytics').select('*').order('created_at', { ascending: false }).limit(5000);
            if (error) throw error;
            
            const rows = data || [];
            const uniqueVisitors = new Set(rows.map(r => r.visitor_id)).size;
            const totalSessions = rows.length;
            const returningCount = rows.filter(r => r.is_returning).length;
            const newCount = totalSessions - returningCount;
            
            // Average session duration (exclude 0-duration pings)
            const withDuration = rows.filter(r => r.session_duration > 0);
            const avgDuration = withDuration.length > 0 ? Math.round(withDuration.reduce((s, r) => s + r.session_duration, 0) / withDuration.length) : 0;
            
            // Device breakdown
            const devices = {};
            rows.forEach(r => { devices[r.device || 'unknown'] = (devices[r.device || 'unknown'] || 0) + 1; });
            
            // Browser breakdown  
            const browsers = {};
            rows.forEach(r => { browsers[r.browser || 'unknown'] = (browsers[r.browser || 'unknown'] || 0) + 1; });
            
            // Top sections by total view time
            const sectionTotals = {};
            rows.forEach(r => {
                if (r.sections_viewed && typeof r.sections_viewed === 'object') {
                    Object.entries(r.sections_viewed).forEach(([section, time]) => {
                        sectionTotals[section] = (sectionTotals[section] || 0) + (time || 0);
                    });
                }
            });
            const topSections = Object.entries(sectionTotals).sort((a, b) => b[1] - a[1]).slice(0, 8);
            
            // Today's visitors
            const today = new Date().toDateString();
            const todayVisits = rows.filter(r => new Date(r.created_at).toDateString() === today).length;
            
            // Location breakdown
            const locations = {};
            rows.forEach(r => {
                const country = r.country || 'Unknown';
                const city = r.city || 'Unknown';
                const region = r.region || 'Unknown';
                const key = `${city}, ${region}`;
                if (!locations[country]) locations[country] = { total: 0, cities: {} };
                locations[country].total++;
                locations[country].cities[key] = (locations[country].cities[key] || 0) + 1;
            });
            const topLocations = Object.entries(locations)
                .sort((a, b) => b[1].total - a[1].total)
                .slice(0, 10);
            
            // Recent 10 sessions
            const recentSessions = rows.slice(0, 10);
            
            setAnalytics({ uniqueVisitors, totalSessions, returningCount, newCount, avgDuration, devices, browsers, topSections, todayVisits, recentSessions, topLocations });
        } catch (err) {
            console.error('Analytics error:', err);
            setAnalytics(null);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    useEffect(() => {
        if (!loading && !user) navigate('/login.html');
    }, [user, loading, navigate]);

    useEffect(() => {
        if (siteData && !formData) {
            // Deep copy + migrate old contact format to new links array format
            const copy = JSON.parse(JSON.stringify(siteData));
            if (copy.contact && !copy.contact.links) {
                // Migrate old flat contact to links array
                const links = [];
                if (copy.contact.whatsapp) links.push({ platform: 'whatsapp', value: copy.contact.whatsapp });
                if (copy.contact.instagram) links.push({ platform: 'instagram', value: copy.contact.instagram });
                if (copy.contact.email) links.push({ platform: 'email', value: copy.contact.email });
                copy.contact.links = links;
            }
            setFormData(copy);
        }
    }, [siteData, formData]);

    useEffect(() => {
        if (activeTab === 'messages') loadMessages();
        if (activeTab === 'analytics') loadAnalytics();
    }, [activeTab]);

    const deleteMessage = async (id) => {
        if (!confirm('Delete this message?')) return;
        await supabase.from('contact_messages').delete().eq('id', id);
        loadMessages();
    };

    const handleSave = async (section) => {
        setSaving(true);
        let dataToSave = formData[section];
        // For contact, also keep flat fields for backward compat
        if (section === 'contact' && formData.contact.links) {
            const flat = {};
            formData.contact.links.forEach(link => {
                flat[link.platform] = link.value;
            });
            dataToSave = { ...flat, links: formData.contact.links };
        }
        const updatedSiteData = { ...siteData, [section]: dataToSave };
        const success = await updateData(updatedSiteData);
        setSaving(false);
        alert(success ? 'Saved successfully!' : 'Error saving. Please try again.');
    };

    // Service helpers
    const updateService = (index, field, value) => {
        const updated = [...formData.services];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, services: updated });
    };

    // Testimonial helpers
    const updateTestimonial = (index, field, value) => {
        const updated = [...formData.testimonials];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, testimonials: updated });
    };
    const addTestimonial = () => {
        setFormData({ ...formData, testimonials: [...formData.testimonials, { text: '', author: '', company: '' }] });
    };
    const removeTestimonial = (index) => {
        if (!confirm('Remove this testimonial?')) return;
        setFormData({ ...formData, testimonials: formData.testimonials.filter((_, i) => i !== index) });
    };

    // Project helpers
    const updateProject = (index, field, value) => {
        const updated = [...formData.projects];
        updated[index] = { ...updated[index], [field]: value };
        // Auto-generate slug from title
        if (field === 'title') {
            updated[index].slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        setFormData({ ...formData, projects: updated });
    };
    const addProject = () => {
        setFormData({ ...formData, projects: [...formData.projects, { image: '', category: '', title: '', slug: '' }] });
    };
    const removeProject = (index) => {
        if (!confirm('Remove this project?')) return;
        setFormData({ ...formData, projects: formData.projects.filter((_, i) => i !== index) });
    };

    // Contact link helpers
    const addContactLink = () => {
        const links = [...(formData.contact?.links || []), { platform: 'custom', value: '' }];
        setFormData({ ...formData, contact: { ...formData.contact, links } });
    };
    const removeContactLink = (index) => {
        if (!confirm('Remove this contact?')) return;
        const links = formData.contact.links.filter((_, i) => i !== index);
        setFormData({ ...formData, contact: { ...formData.contact, links } });
    };
    const updateContactLink = (index, field, value) => {
        const links = [...formData.contact.links];
        links[index] = { ...links[index], [field]: value };
        setFormData({ ...formData, contact: { ...formData.contact, links } });
    };

    const getPreset = (platform) => platformPresets.find(p => p.value === platform) || platformPresets[platformPresets.length - 1];

    const themePresets = [
        { name: 'Chocolat', hex: '#5A3A22' },
        { name: 'Original Pink', hex: '#FF9A8B' },
        { name: 'Ocean Blue', hex: '#0093E9' },
        { name: 'Emerald', hex: '#00b09b' },
        { name: 'Royal Purple', hex: '#B721FF' }
    ];

    if (loading || dataLoading || !formData) return <div style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'var(--font-sans)', color: 'var(--muted)' }}>Loading admin...</div>;

    const tabs = [
        { id: 'theme', icon: 'fa-solid fa-palette', label: 'Theme Colors' },
        { id: 'hero', icon: 'fa-solid fa-house', label: 'Hero Section' },
        { id: 'about', icon: 'fa-solid fa-user', label: 'About' },
        { id: 'services', icon: 'fa-solid fa-briefcase', label: 'Services' },
        { id: 'projects', icon: 'fa-solid fa-images', label: 'Projects' },
        { id: 'testimonials', icon: 'fa-solid fa-quote-left', label: 'Testimonials' },
        { id: 'contact', icon: 'fa-solid fa-envelope', label: 'Contact Info' },
        { id: 'messages', icon: 'fa-solid fa-envelope-open-text', label: 'Inbox' },
        { id: 'analytics', icon: 'fa-solid fa-chart-line', label: 'Analytics' },
    ];

    return (
        <div className="admin-container">
            {/* Creative Admin Cursor */}
            <div ref={cursorRef} className="admin-cursor-dot"></div>
            <div ref={cursorRingRef} className="admin-cursor-ring"></div>

            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>Admin<span>.</span></h2>
                </div>
                <ul className="sidebar-nav">
                    {tabs.map(tab => (
                        <li key={tab.id}>
                            <a href="#" className={activeTab === tab.id ? 'active' : ''} onClick={(e) => { e.preventDefault(); setActiveTab(tab.id); }}>
                                <i className={tab.icon}></i> {tab.label}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="sidebar-bottom">
                    <a href="/" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-arrow-up-right-from-square"></i> View Live Site</a>
                    <a href="#" onClick={(e) => { e.preventDefault(); signOut(); }}><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                </div>
            </aside>

            <main className="main-content">

                {/* ========== THEME COLORS ========== */}
                {activeTab === 'theme' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Theme Colors</h2>
                                <button className="btn-admin" onClick={() => handleSave('theme')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Primary Theme Color</label>
                                <p className="form-hint" style={{ marginBottom: '1rem' }}>Select a color to update the website's entire look instantly.</p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                    {themePresets.map(preset => (
                                        <div 
                                            key={preset.hex}
                                            onClick={() => setFormData({ ...formData, theme: { ...formData.theme, primaryColor: preset.hex } })}
                                            style={{
                                                background: preset.hex,
                                                height: '60px',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                border: formData.theme?.primaryColor === preset.hex ? '4px solid #fff' : '2px solid transparent',
                                                boxShadow: formData.theme?.primaryColor === preset.hex ? `0 0 0 2px ${preset.hex}` : '0 4px 10px rgba(0,0,0,0.1)',
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                padding: '0.5rem',
                                                color: '#fff',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                textShadow: '0 1px 3px rgba(0,0,0,0.8)'
                                            }}
                                        >
                                            {preset.name}
                                        </div>
                                    ))}
                                </div>
                                <label className="form-label">Custom Hex Color</label>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    <input 
                                        type="color" 
                                        value={formData.theme?.primaryColor || '#5A3A22'} 
                                        onChange={e => setFormData({ ...formData, theme: { ...formData.theme, primaryColor: e.target.value } })}
                                        style={{ width: '50px', height: '50px', border: 'none', borderRadius: '5px', cursor: 'pointer', padding: 0 }}
                                    />
                                    <input 
                                        type="text" 
                                        className="form-input" 
                                        style={{ maxWidth: '150px', margin: 0 }}
                                        value={formData.theme?.primaryColor || '#5A3A22'} 
                                        onChange={e => setFormData({ ...formData, theme: { ...formData.theme, primaryColor: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== HERO SECTION ========== */}
                {activeTab === 'hero' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Hero Section</h2>
                                <button className="btn-admin" onClick={() => handleSave('hero')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Title</label>
                                <input type="text" className="form-input" value={formData.hero?.title || ''} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, title: e.target.value } })} />
                                <small className="form-hint">Use \n for line break</small>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Subtitle</label>
                                <textarea className="form-input" rows="3" value={formData.hero?.subtitle || ''} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, subtitle: e.target.value } })}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Background Image URL</label>
                                <input type="text" className="form-input" value={formData.hero?.bgImage || ''} onChange={e => setFormData({ ...formData, hero: { ...formData.hero, bgImage: e.target.value } })} />
                            </div>
                            {formData.hero?.bgImage && (
                                <div className="preview-box">
                                    <p className="form-hint">Preview:</p>
                                    <img src={formData.hero.bgImage} alt="Hero BG Preview" style={{ maxHeight: '120px', borderRadius: '8px' }} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ========== ABOUT SECTION ========== */}
                {activeTab === 'about' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>About Section</h2>
                                <button className="btn-admin" onClick={() => handleSave('about')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Greeting</label>
                                <input type="text" className="form-input" value={formData.about?.greeting || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, greeting: e.target.value } })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Profile Image URL</label>
                                <input type="text" className="form-input" value={formData.about?.profileImage || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, profileImage: e.target.value } })} />
                            </div>
                            {formData.about?.profileImage && (
                                <div className="preview-box">
                                    <p className="form-hint">Preview:</p>
                                    <img src={formData.about.profileImage} alt="Profile Preview" style={{ maxHeight: '120px', borderRadius: '8px' }} />
                                </div>
                            )}
                            <div className="form-group">
                                <label className="form-label">Paragraph 1</label>
                                <textarea className="form-input" rows="4" value={formData.about?.p1 || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, p1: e.target.value } })}></textarea>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Paragraph 2</label>
                                <textarea className="form-input" rows="4" value={formData.about?.p2 || ''} onChange={e => setFormData({ ...formData, about: { ...formData.about, p2: e.target.value } })}></textarea>
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== SERVICES SECTION ========== */}
                {activeTab === 'services' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Services</h2>
                                <button className="btn-admin" onClick={() => handleSave('services')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                            <p className="form-hint" style={{ marginBottom: '1.5rem' }}>Edit each service card. Use Font Awesome class names for icons (e.g. fa-pen-nib).</p>
                            <div className="services-grid-admin">
                                {(formData.services || []).map((service, idx) => (
                                    <div key={idx} className="admin-card">
                                        <div className="admin-card-header">
                                            <span className="admin-card-num">{String(idx + 1).padStart(2, '0')}</span>
                                            <i className={`fa-solid ${service.icon}`} style={{ fontSize: '1.5rem', color: 'var(--accent)' }}></i>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Icon Class</label>
                                            <input type="text" className="form-input" value={service.icon || ''} onChange={e => updateService(idx, 'icon', e.target.value)} placeholder="fa-pen-nib" />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Title</label>
                                            <input type="text" className="form-input" value={service.title || ''} onChange={e => updateService(idx, 'title', e.target.value)} />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea className="form-input" rows="2" value={service.description || ''} onChange={e => updateService(idx, 'description', e.target.value)}></textarea>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== PROJECTS SECTION ========== */}
                {activeTab === 'projects' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Design Work / Projects</h2>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button className="btn-admin btn-outline-admin" onClick={addProject}>+ Add Project</button>
                                    <button className="btn-admin" onClick={() => handleSave('projects')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </div>
                            <p className="form-hint" style={{ marginBottom: '1.5rem' }}>Manage your portfolio projects. Each project appears in the Design Work grid on the landing page.</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {(formData.projects || []).map((proj, idx) => (
                                    <div key={idx} className="admin-card">
                                        <div className="admin-card-header">
                                            <span className="admin-card-num">{String(idx + 1).padStart(2, '0')}</span>
                                            <button onClick={() => removeProject(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <i className="fa-solid fa-trash"></i> Remove
                                            </button>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Title</label>
                                                <input type="text" className="form-input" value={proj.title || ''} onChange={e => updateProject(idx, 'title', e.target.value)} placeholder="Project Name" />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Category</label>
                                                <input type="text" className="form-input" value={proj.category || ''} onChange={e => updateProject(idx, 'category', e.target.value)} placeholder="e.g. Branding, Logo Design" />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Image URL</label>
                                                <input type="text" className="form-input" value={proj.image || ''} onChange={e => updateProject(idx, 'image', e.target.value)} placeholder="/assets/images/portfolio/..." />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Slug (auto-generated)</label>
                                                <input type="text" className="form-input" value={proj.slug || ''} readOnly style={{ opacity: 0.6 }} />
                                            </div>
                                        </div>
                                        {proj.image && (
                                            <div className="preview-box" style={{ marginTop: '0.5rem' }}>
                                                <img src={proj.image} alt={proj.title} style={{ maxHeight: '80px', borderRadius: '8px' }} onError={e => e.target.style.display = 'none'} />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== TESTIMONIALS SECTION ========== */}
                {activeTab === 'testimonials' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Testimonials</h2>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button className="btn-admin btn-outline-admin" onClick={addTestimonial}>+ Add New</button>
                                    <button className="btn-admin" onClick={() => handleSave('testimonials')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </div>
                            {(formData.testimonials || []).length === 0 && <p style={{ color: 'var(--muted)' }}>No testimonials yet. Click "Add New" to create one.</p>}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {(formData.testimonials || []).map((t, idx) => (
                                    <div key={idx} className="admin-card" style={{ position: 'relative' }}>
                                        <div className="admin-card-header">
                                            <span className="admin-card-num">{String(idx + 1).padStart(2, '0')}</span>
                                            <button onClick={() => removeTestimonial(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem' }}>
                                                <i className="fa-solid fa-trash"></i> Remove
                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Testimonial Text</label>
                                            <textarea className="form-input" rows="3" value={t.text || ''} onChange={e => updateTestimonial(idx, 'text', e.target.value)}></textarea>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group">
                                                <label className="form-label">Author Name</label>
                                                <input type="text" className="form-input" value={t.author || ''} onChange={e => updateTestimonial(idx, 'author', e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <label className="form-label">Company</label>
                                                <input type="text" className="form-input" value={t.company || ''} onChange={e => updateTestimonial(idx, 'company', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== CONTACT SECTION (Dynamic Platforms) ========== */}
                {activeTab === 'contact' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Contact Information</h2>
                                <div style={{ display: 'flex', gap: '0.8rem' }}>
                                    <button className="btn-admin btn-outline-admin" onClick={addContactLink}>+ Add Platform</button>
                                    <button className="btn-admin" onClick={() => handleSave('contact')} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
                                </div>
                            </div>
                            <p className="form-hint" style={{ marginBottom: '1.5rem' }}>Add any social media or contact platform. These will appear in your website footer and contact section.</p>
                            {(formData.contact?.links || []).length === 0 && <p style={{ color: 'var(--muted)' }}>No contact links yet. Click "+ Add Platform" to add one.</p>}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {(formData.contact?.links || []).map((link, idx) => {
                                    const preset = getPreset(link.platform);
                                    return (
                                        <div key={idx} className="admin-card contact-link-card">
                                            <div className="contact-link-row">
                                                <div className="contact-link-icon">
                                                    <i className={preset.icon} style={{ fontSize: '1.4rem', color: 'var(--accent)' }}></i>
                                                </div>
                                                <div className="contact-link-fields">
                                                    <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                                                        <select className="form-input form-select" value={link.platform} onChange={e => updateContactLink(idx, 'platform', e.target.value)}>
                                                            {platformPresets.map(p => (
                                                                <option key={p.value} value={p.value}>{p.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                                        <input type="text" className="form-input" placeholder={preset.placeholder} value={link.value || ''} onChange={e => updateContactLink(idx, 'value', e.target.value)} />
                                                    </div>
                                                </div>
                                                <button className="contact-link-delete" onClick={() => removeContactLink(idx)} title="Remove">
                                                    <i className="fa-solid fa-xmark"></i>
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== INBOX SECTION ========== */}
                {activeTab === 'messages' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Client Inbox</h2>
                                <button className="btn-admin btn-outline-admin" onClick={loadMessages}>Refresh</button>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {messages.length === 0 ? <p style={{ color: 'var(--muted)' }}>No messages yet.</p> :
                                    messages.map(msg => (
                                        <div key={msg.id} className="admin-card" style={{ position: 'relative' }}>
                                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{msg.name}</h3>
                                            <a href={`mailto:${msg.email}`} style={{ color: 'var(--accent)', textDecoration: 'none', display: 'block', marginBottom: '1rem', fontSize: '0.9rem' }}>{msg.email}</a>
                                            <p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6, color: 'var(--muted)' }}>{msg.message}</p>
                                            <small style={{ display: 'block', marginTop: '1rem', color: 'var(--muted)', opacity: 0.6 }}>{new Date(msg.created_at).toLocaleString()}</small>
                                            <button style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} onClick={() => deleteMessage(msg.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}

                {/* ========== ANALYTICS SECTION ========== */}
                {activeTab === 'analytics' && (
                    <div className="panel active">
                        <div className="admin-section">
                            <div className="admin-section-head">
                                <h2>Website Analytics</h2>
                                <button className="btn-admin btn-outline-admin" onClick={loadAnalytics} disabled={analyticsLoading}>
                                    {analyticsLoading ? 'Loading...' : 'Refresh'}
                                </button>
                            </div>

                            {!analytics && !analyticsLoading && (
                                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>
                                    <i className="fa-solid fa-chart-line" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.3 }}></i>
                                    <p>No analytics data yet. Make sure you've created the <code>page_analytics</code> table in Supabase.</p>
                                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Run the SQL from <strong>supabase_analytics.sql</strong> in your Supabase SQL Editor.</p>
                                </div>
                            )}

                            {analytics && (
                                <>
                                    {/* Stats Cards */}
                                    <div className="analytics-grid">
                                        <div className="analytics-card">
                                            <div className="analytics-card-icon" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>
                                                <i className="fa-solid fa-eye"></i>
                                            </div>
                                            <div className="analytics-card-num">{analytics.totalSessions}</div>
                                            <div className="analytics-card-label">Total Visits</div>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-card-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                                                <i className="fa-solid fa-users"></i>
                                            </div>
                                            <div className="analytics-card-num">{analytics.uniqueVisitors}</div>
                                            <div className="analytics-card-label">Unique Visitors</div>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-card-icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                                                <i className="fa-solid fa-rotate"></i>
                                            </div>
                                            <div className="analytics-card-num">{analytics.returningCount}</div>
                                            <div className="analytics-card-label">Returning Users</div>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-card-icon" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
                                                <i className="fa-solid fa-clock"></i>
                                            </div>
                                            <div className="analytics-card-num">{analytics.avgDuration > 60 ? `${Math.floor(analytics.avgDuration / 60)}m ${analytics.avgDuration % 60}s` : `${analytics.avgDuration}s`}</div>
                                            <div className="analytics-card-label">Avg. Session Time</div>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-card-icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                                                <i className="fa-solid fa-calendar-day"></i>
                                            </div>
                                            <div className="analytics-card-num">{analytics.todayVisits}</div>
                                            <div className="analytics-card-label">Today's Visits</div>
                                        </div>
                                        <div className="analytics-card">
                                            <div className="analytics-card-icon" style={{ background: 'rgba(139,92,246,0.1)', color: '#8b5cf6' }}>
                                                <i className="fa-solid fa-user-plus"></i>
                                            </div>
                                            <div className="analytics-card-num">{analytics.newCount}</div>
                                            <div className="analytics-card-label">New Users</div>
                                        </div>
                                    </div>

                                    {/* Device & Browser Breakdown */}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2rem' }}>
                                        <div className="admin-card">
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.2rem' }}>
                                                <i className="fa-solid fa-mobile-screen" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i> Devices
                                            </h3>
                                            {Object.entries(analytics.devices).sort((a,b) => b[1]-a[1]).map(([device, count]) => {
                                                const pct = Math.round((count / analytics.totalSessions) * 100);
                                                return (
                                                    <div key={device} style={{ marginBottom: '0.8rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                                                            <span style={{ textTransform: 'capitalize', color: 'var(--text)', fontWeight: 500 }}>
                                                                <i className={`fa-solid ${device === 'mobile' ? 'fa-mobile-screen' : device === 'tablet' ? 'fa-tablet-screen-button' : 'fa-desktop'}`} style={{ marginRight: '0.5rem', color: 'var(--muted)' }}></i>
                                                                {device}
                                                            </span>
                                                            <span style={{ color: 'var(--muted)' }}>{count} ({pct}%)</span>
                                                        </div>
                                                        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="admin-card">
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.2rem' }}>
                                                <i className="fa-solid fa-globe" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i> Browsers
                                            </h3>
                                            {Object.entries(analytics.browsers).sort((a,b) => b[1]-a[1]).map(([browser, count]) => {
                                                const pct = Math.round((count / analytics.totalSessions) * 100);
                                                return (
                                                    <div key={browser} style={{ marginBottom: '0.8rem' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                                                            <span style={{ color: 'var(--text)', fontWeight: 500 }}>{browser}</span>
                                                            <span style={{ color: 'var(--muted)' }}>{count} ({pct}%)</span>
                                                        </div>
                                                        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                                            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Top Sections */}
                                    {analytics.topSections.length > 0 && (
                                        <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                                            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.2rem' }}>
                                                <i className="fa-solid fa-fire" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i> Most Viewed Sections
                                            </h3>
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                                                {analytics.topSections.map(([section, totalTime], idx) => (
                                                    <div key={section} style={{
                                                        background: idx === 0 ? 'rgba(255,154,139,0.06)' : 'var(--bg)',
                                                        border: `1px solid ${idx === 0 ? 'rgba(255,106,136,0.2)' : 'var(--border)'}`,
                                                        borderRadius: '10px', padding: '1rem', textAlign: 'center'
                                                    }}>
                                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--muted)', marginBottom: '0.4rem' }}>
                                                            {idx === 0 && <><i className="fa-solid fa-crown" style={{ color: '#f59e0b' }}></i>{' '}</>}
                                                            #{idx + 1}
                                                        </div>
                                                        <div style={{ fontWeight: 600, color: 'var(--text)', textTransform: 'capitalize', fontSize: '0.95rem' }}>{section}</div>
                                                        <div style={{ fontSize: '0.85rem', color: 'var(--accent)', marginTop: '0.3rem' }}>
                                                            {totalTime > 60 ? `${Math.floor(totalTime / 60)}m ${totalTime % 60}s` : `${totalTime}s`} total
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Visitor Regions */}
                                    {analytics.topLocations && analytics.topLocations.length > 0 && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                                            <div className="admin-card">
                                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.2rem' }}>
                                                    <i className="fa-solid fa-earth-americas" style={{ color: '#10b981', marginRight: '0.5rem' }}></i> Visitor Countries
                                                </h3>
                                                {analytics.topLocations.map(([country, info]) => {
                                                    const pct = Math.round((info.total / analytics.totalSessions) * 100);
                                                    return (
                                                        <div key={country} style={{ marginBottom: '0.8rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                                                                <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                                                                    <i className="fa-solid fa-location-dot" style={{ marginRight: '0.4rem', color: '#10b981' }}></i>
                                                                    {country}
                                                                </span>
                                                                <span style={{ color: 'var(--muted)' }}>{info.total} ({pct}%)</span>
                                                            </div>
                                                            <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                                                <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="admin-card">
                                                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.2rem' }}>
                                                    <i className="fa-solid fa-city" style={{ color: '#3b82f6', marginRight: '0.5rem' }}></i> Top Cities
                                                </h3>
                                                {(() => {
                                                    const allCities = [];
                                                    analytics.topLocations.forEach(([country, info]) => {
                                                        Object.entries(info.cities).forEach(([city, count]) => {
                                                            allCities.push({ city, country, count });
                                                        });
                                                    });
                                                    allCities.sort((a, b) => b.count - a.count);
                                                    return allCities.slice(0, 8).map((c, i) => {
                                                        const pct = Math.round((c.count / analytics.totalSessions) * 100);
                                                        return (
                                                            <div key={i} style={{ marginBottom: '0.8rem' }}>
                                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                                                                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>
                                                                        <i className="fa-solid fa-map-pin" style={{ marginRight: '0.4rem', color: '#3b82f6' }}></i>
                                                                        {c.city}
                                                                    </span>
                                                                    <span style={{ color: 'var(--muted)' }}>{c.count} ({pct}%)</span>
                                                                </div>
                                                                <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                                                                    <div style={{ width: `${Math.max(pct, 5)}%`, height: '100%', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)', borderRadius: '3px', transition: 'width 0.5s ease' }}></div>
                                                                </div>
                                                            </div>
                                                        );
                                                    });
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Recent Sessions */}
                                    <div className="admin-card" style={{ marginTop: '1.5rem' }}>
                                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--text)', marginBottom: '1.2rem' }}>
                                            <i className="fa-solid fa-clock-rotate-left" style={{ color: 'var(--accent)', marginRight: '0.5rem' }}></i> Recent Visits
                                        </h3>
                                        <div style={{ overflowX: 'auto' }}>
                                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                                                <thead>
                                                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                                        <th style={{ textAlign: 'left', padding: '0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Time</th>
                                                        <th style={{ textAlign: 'left', padding: '0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Device</th>
                                                        <th style={{ textAlign: 'left', padding: '0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Browser</th>
                                                        <th style={{ textAlign: 'left', padding: '0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Duration</th>
                                                        <th style={{ textAlign: 'left', padding: '0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Location</th>
                                                        <th style={{ textAlign: 'left', padding: '0.7rem', color: 'var(--muted)', fontWeight: 600, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {analytics.recentSessions.map((s, i) => (
                                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                                            <td style={{ padding: '0.7rem', color: 'var(--text)' }}>{new Date(s.created_at).toLocaleString()}</td>
                                                            <td style={{ padding: '0.7rem', textTransform: 'capitalize' }}>
                                                                <i className={`fa-solid ${s.device === 'mobile' ? 'fa-mobile-screen' : s.device === 'tablet' ? 'fa-tablet-screen-button' : 'fa-desktop'}`} style={{ marginRight: '0.4rem', color: 'var(--accent)' }}></i>
                                                                {s.device}
                                                            </td>
                                                            <td style={{ padding: '0.7rem', color: 'var(--muted)' }}>{s.browser}</td>
                                                            <td style={{ padding: '0.7rem', color: 'var(--text)', fontWeight: 500 }}>
                                                                {s.session_duration > 60 ? `${Math.floor(s.session_duration / 60)}m ${s.session_duration % 60}s` : `${s.session_duration}s`}
                                                            </td>
                                                            <td style={{ padding: '0.7rem', color: 'var(--muted)', fontSize: '0.85rem' }}>
                                                                <i className="fa-solid fa-location-dot" style={{ marginRight: '0.3rem', color: '#10b981', fontSize: '0.75rem' }}></i>
                                                                {s.city && s.city !== 'Unknown' ? `${s.city}, ${s.country}` : s.country || 'Unknown'}
                                                            </td>
                                                            <td style={{ padding: '0.7rem' }}>
                                                                <span style={{
                                                                    padding: '0.25rem 0.7rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600,
                                                                    background: s.is_returning ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                                                                    color: s.is_returning ? '#f59e0b' : '#10b981'
                                                                }}>{s.is_returning ? 'Returning' : 'New'}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
