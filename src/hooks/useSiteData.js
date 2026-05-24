import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const defaultData = {
    header: {
        logoUrl: ""
    },
    hero: {
        title: "Let's Create\nSomething Amazing.",
        subtitle: "Logos, Branding, Social Media Designs & Creative Visual Experiences.",
        bgImage: "/assets/images/hero-bg.png"
    },
    about: {
        greeting: "Hello, I'm Nandani.",
        p1: "I am a high-tier freelance visual identity expert dedicated to transforming your brand's vision into a stunning visual reality. With a deep passion for modern aesthetics and premium design, I specialize in creating designs that not only look beautiful but also communicate effectively.",
        p2: "My expertise spans across Logo Design, Comprehensive Branding, Social Media Creatives, Thumbnails, Posters, and bespoke Creative Visual Identities. Let's build a brand that stands out in the digital landscape.",
        profileImage: '/assets/images/portfolio/nandani image.jpg'
    },
    contact: {
        whatsapp: '+91 9343407099',
        instagram: '@nandani_graphicano',
        email: 'Patidarnandani761@gmail.com',
        links: [
            { platform: 'whatsapp', value: '+91 9343407099' },
            { platform: 'instagram', value: '@nandani_graphicano' },
            { platform: 'email', value: 'Patidarnandani761@gmail.com' }
        ]
    },
    services: [
        { icon: "fa-pen-nib", title: "Logo Design", description: "Bespoke logos that capture your brand's essence perfectly." },
        { icon: "fa-object-group", title: "Branding", description: "Complete brand identities including typography and colors." },
        { icon: "fa-hashtag", title: "Social Media", description: "Eye-catching creatives for Instagram, Facebook & Twitter." },
        { icon: "fa-image", title: "Thumbnails & Posters", description: "High-clickrate thumbnails and stunning poster designs." }
    ],
    projects: [
        { image: "/assets/images/portfolio/advatika 1.jpeg", category: "Branding", title: "Advaita Agronics", slug: "advaita-agronics" },
        { image: "/assets/images/portfolio/logo-1.png", category: "Logo Design", title: "Premium Identity", slug: "premium-identity" },
        { image: "/assets/images/portfolio/logo-2.png", category: "Logo Design", title: "Minimalist Mark", slug: "minimalist-mark" },
        { image: "/assets/images/portfolio/branding-1.png", category: "Branding", title: "Brand Guidelines", slug: "brand-guidelines" },
        { image: "/assets/images/portfolio/business-1.png", category: "Print Design", title: "Corporate Assets", slug: "corporate-assets" },
        { image: "/assets/images/portfolio/poster-1.png", category: "Marketing", title: "Event Poster", slug: "event-poster" },
        { image: "/assets/images/portfolio/social-1.png", category: "Social Media", title: "Instagram Grid", slug: "instagram-grid" },
        { image: "/assets/images/portfolio/social-2.png", category: "Social Media", title: "Facebook Campaign", slug: "facebook-campaign" },
        { image: "/assets/images/portfolio/template-1.png", category: "UI/UX", title: "Web Template", slug: "web-template" },
        { image: "/assets/images/portfolio/thumbnail-1.png", category: "YouTube", title: "Viral Thumbnail", slug: "viral-thumbnail" }
    ],
    testimonials: [
        { text: "Nandani completely transformed our brand identity. The attention to detail and creative vision is unmatched. Every deliverable exceeded our expectations.", author: "Sarah J.", company: "TechFlow" },
        { text: "Incredible designer with brilliant aesthetic sense. Fast turnaround, super responsive communication, and the final results were absolutely stunning.", author: "Mark D.", company: "Elevate" },
        { text: "Working with Nandani was a game-changer for our startup. She understood our vision perfectly and delivered a brand identity that truly represents us.", author: "Priya K.", company: "GreenLeaf" }
    ],
    tools: [
        { icon: "fa-brands fa-adobe", name: "Adobe Creative Cloud" },
        { icon: "fa-solid fa-pen-nib", name: "Illustrator" },
        { icon: "fa-solid fa-image", name: "Photoshop" },
        { icon: "fa-solid fa-paintbrush", name: "Canva" }
    ],
    features: [
        { icon: 'fa-solid fa-wand-magic-sparkles', title: 'Creative Designs', desc: 'Unique, out-of-the-box concepts that captivate.' },
        { icon: 'fa-solid fa-bolt', title: 'Fast Delivery', desc: 'Rapid turnaround without compromising quality.' },
        { icon: 'fa-solid fa-gem', title: 'Modern Aesthetics', desc: 'Staying ahead with ultra-premium design trends.' },
        { icon: 'fa-solid fa-star', title: 'Pro Quality', desc: 'Pixel-perfect execution in every single detail.' }
    ],
    theme: {
        primaryColor: "#5A3A22",
        bgColor: "linear-gradient(to right top, #f5e4fb, #efdaf7, #e9d0f2, #e3c6ee, #ddbcea)"
    }
};

function applyThemeColor(themeObj) {
    if (!themeObj) return;
    
    const root = document.documentElement;

    // Apply primary color
    if (themeObj.primaryColor) {
        const hexColor = themeObj.primaryColor;
        const r = parseInt(hexColor.slice(1, 3), 16);
        const g = parseInt(hexColor.slice(3, 5), 16);
        const b = parseInt(hexColor.slice(5, 7), 16);
        root.style.setProperty('--accent', hexColor);
        root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
        root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hexColor} 0%, rgba(${r},${g},${b},0.8) 55%, rgba(${r},${g},${b},0.6) 100%)`);
        root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.1)`);
    }

    // Apply background color
    if (themeObj.bgColor) {
        root.style.setProperty('--bg', themeObj.bgColor);
        root.style.setProperty('--card', themeObj.bgColor);
    }
}

export function useSiteData() {
    const [data, setData] = useState(defaultData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSiteData() {
            try {
                const { data: dbData, error } = await supabase
                    .from('site_data')
                    .select('data')
                    .eq('id', 1)
                    .single();
                
                if (error) throw error;
                if (dbData && dbData.data && Object.keys(dbData.data).length > 0) {
                    const db = dbData.data;
                    const merged = { ...defaultData };
                    
                    // Override each section ONLY if DB has non-empty data
                    if (db.hero && db.hero.title) merged.hero = { ...defaultData.hero, ...db.hero };
                    if (db.about && db.about.greeting) merged.about = { ...defaultData.about, ...db.about };
                    if (db.contact) {
                        merged.contact = { ...defaultData.contact, ...db.contact };
                        // If DB has links array, always use it (don't let default overwrite)
                        if (db.contact.links && Array.isArray(db.contact.links)) {
                            merged.contact.links = db.contact.links;
                        } else {
                            // Migrate old flat contact fields to links array
                            const links = [];
                            if (db.contact.whatsapp) links.push({ platform: 'whatsapp', value: db.contact.whatsapp });
                            if (db.contact.instagram) links.push({ platform: 'instagram', value: db.contact.instagram });
                            if (db.contact.email) links.push({ platform: 'email', value: db.contact.email });
                            if (links.length > 0) merged.contact.links = links;
                        }
                    }
                    
                    // Services: only use DB if it has valid entries with titles
                    if (db.services && Array.isArray(db.services) && db.services.length > 0 && db.services[0].title) {
                        merged.services = db.services;
                    }
                    
                    // Testimonials: only use DB if it has valid entries with text
                    if (db.testimonials && Array.isArray(db.testimonials) && db.testimonials.length > 0 && db.testimonials[0].text) {
                        merged.testimonials = db.testimonials;
                    }
                    
                    // Projects: only use DB if entries have slugs
                    if (db.projects && Array.isArray(db.projects) && db.projects.length > 0 && db.projects[0].slug) {
                        merged.projects = db.projects;
                    }

                    if (db.tools && Array.isArray(db.tools) && db.tools.length > 0 && db.tools[0].name) {
                        merged.tools = db.tools;
                    }

                    if (db.features && Array.isArray(db.features) && db.features.length > 0 && db.features[0].title) {
                        merged.features = db.features;
                    }

                    if (db.theme) {
                        merged.theme = { ...merged.theme, ...db.theme };
                    }
                    
                    localStorage.setItem('site_theme', JSON.stringify(merged.theme));
                    applyThemeColor(merged.theme);
                    setData(merged);
                } else {
                    localStorage.setItem('site_theme', JSON.stringify(defaultData.theme));
                    applyThemeColor(defaultData.theme);
                }
            } catch (err) {
                console.error("Failed to load site data:", err);
            } finally {
                setLoading(false);
            }
        }
        
        fetchSiteData();
    }, []);

    const updateData = async (newData) => {
        try {
            const { error } = await supabase.from('site_data').upsert({ id: 1, data: newData });
            if (error) throw error;
            if (newData.theme) {
                localStorage.setItem('site_theme', JSON.stringify(newData.theme));
                applyThemeColor(newData.theme);
            }
            setData(newData);
            return true;
        } catch (err) {
            console.error("Failed to save data:", err);
            return false;
        }
    };

    return { data, updateData, loading };
}
