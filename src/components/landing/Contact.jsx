import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contact({ data }) {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        setStatus('loading');
        
        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    status: 'Unread'
                }]);
                
            if (error) throw error;
            
            setStatus('success');
            e.target.reset();
            
            setTimeout(() => setStatus('idle'), 4000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <section id="contact" style={{ padding: '8rem 5%', background: 'var(--card)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Let's Create<br/><span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Something Amazing.</span>
                    </h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '4rem', fontSize: '1.2rem', lineHeight: 1.8 }}>
                        Ready to elevate your brand's visual identity? Get in touch today to discuss your next big project.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {data?.contact?.links && data.contact.links.length > 0 ? (
                            data.contact.links.map((link, idx) => {
                                const platformIcons = {
                                    whatsapp: 'fa-brands fa-whatsapp',
                                    instagram: 'fa-brands fa-instagram',
                                    email: 'fa-regular fa-envelope',
                                    linkedin: 'fa-brands fa-linkedin-in',
                                    behance: 'fa-brands fa-behance',
                                    dribbble: 'fa-brands fa-dribbble',
                                    youtube: 'fa-brands fa-youtube',
                                    twitter: 'fa-brands fa-x-twitter',
                                    facebook: 'fa-brands fa-facebook-f',
                                    phone: 'fa-solid fa-phone',
                                    website: 'fa-solid fa-globe',
                                    custom: 'fa-solid fa-link'
                                };
                                const iconClass = platformIcons[link.platform] || 'fa-solid fa-link';
                                let href = link.value || '';
                                if (link.platform === 'whatsapp') href = `https://wa.me/${href.replace(/[^0-9]/g, '')}`;
                                else if (link.platform === 'email') href = `mailto:${href}`;
                                else if (link.platform === 'instagram' && !href.includes('instagram.com')) href = `https://instagram.com/${href.replace('@', '')}`;
                                else if (link.platform === 'twitter' && !href.includes('twitter.com') && !href.includes('x.com')) href = `https://twitter.com/${href.replace('@', '')}`;
                                else if (href && !href.startsWith('http') && !href.startsWith('mailto')) href = `https://${href}`;

                                return (
                                    <a key={idx} href={href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                        <div style={{ width: '50px', height: '50px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(255, 106, 136, 0.2)', transition: 'all 0.3s' }}>
                                            <i className={iconClass}></i>
                                        </div>
                                        <span style={{ color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '1px', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>{link.value}</span>
                                    </a>
                                );
                            })
                        ) : (
                            <>
                                <a href={`https://wa.me/${(data?.contact?.whatsapp || '+91 9343407099').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{ width: '50px', height: '50px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(255, 106, 136, 0.2)', transition: 'all 0.3s' }}>
                                        <i className="fa-brands fa-whatsapp"></i>
                                    </div>
                                    <span style={{ color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '1px', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>{data?.contact?.whatsapp || '+91 9343407099'}</span>
                                </a>
                                <a href={`mailto:${data?.contact?.email || 'Patidarnandani761@gmail.com'}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', textDecoration: 'none' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                                    <div style={{ width: '50px', height: '50px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(255, 106, 136, 0.2)', transition: 'all 0.3s' }}>
                                        <i className="fa-regular fa-envelope"></i>
                                    </div>
                                    <span style={{ color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '1px', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>{data?.contact?.email || 'Patidarnandani761@gmail.com'}</span>
                                </a>
                            </>
                        )}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '4rem 3rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <input name="name" type="text" placeholder="Your Name" required style={{
                                width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text)', outline: 'none'
                            }} />
                        </div>
                        <div>
                            <input name="email" type="email" placeholder="Your Email" required style={{
                                width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text)', outline: 'none'
                            }} />
                        </div>
                        <div>
                            <textarea name="message" rows="5" placeholder="Tell me about your project..." required style={{
                                width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text)', resize: 'vertical', outline: 'none'
                            }}></textarea>
                        </div>
                        <button type="submit" disabled={status === 'loading'} style={{
                            width: '100%', padding: '1.2rem', background: status === 'success' ? '#2e7d32' : 'var(--accent-gradient)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'none', transition: 'all 0.3s', boxShadow: '0 5px 15px rgba(var(--accent-rgb), 0.2)'
                        }}>
                            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Error. Try Again' : 'Hire Me'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
