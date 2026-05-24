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
        email: 'Patidarnandani761@gmail.com'
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
    theme: {
        primaryColor: "#5A3A22"
    }
};

function applyThemeColor(hexColor) {
    if (!hexColor) return;
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const root = document.documentElement;
    root.style.setProperty('--accent', hexColor);
    root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hexColor} 0%, rgba(${r},${g},${b},0.8) 55%, rgba(${r},${g},${b},0.6) 100%)`);
    root.style.setProperty('--accent-glow', `rgba(${r}, ${g}, ${b}, 0.1)`);
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
                    if (db.contact) merged.contact = { ...defaultData.contact, ...db.contact };
                    
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

                    if (db.theme && db.theme.primaryColor) {
                        merged.theme = db.theme;
                    }
                    
                    applyThemeColor(merged.theme.primaryColor);
                    setData(merged);
                } else {
                    applyThemeColor(defaultData.theme.primaryColor);
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
            if (newData.theme && newData.theme.primaryColor) {
                applyThemeColor(newData.theme.primaryColor);
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
