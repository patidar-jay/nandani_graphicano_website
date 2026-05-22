/* ══════════════════════════════════════════════════════
   SITE DATA — Shared localStorage layer for Admin ↔ Site
   ══════════════════════════════════════════════════════ */

const SiteData = {
    
    // Default data (used if nothing saved yet)
    defaults: {
        hero: {
            line1: 'Creative',
            line2: 'Graphic Designer',
            subtitle: 'Logos, Branding, Social Media Designs & Creative Visual Experiences.',
            cta1: 'View Portfolio',
            cta2: 'Hire Me'
        },
        about: {
            title: 'The Brand Story',
            subtitle: 'Crafting visual identities that leave a lasting impression.',
            greeting: "Hello, I'm Nandani.",
            p1: "I am a high-tier freelance visual identity expert dedicated to transforming your brand's vision into a stunning visual reality. With a deep passion for modern aesthetics and premium design, I specialize in creating designs that not only look beautiful but also communicate effectively.",
            p2: "My expertise spans across Logo Design, Comprehensive Branding, Social Media Creatives, Thumbnails, Posters, and bespoke Creative Visual Identities. Let's build a brand that stands out in the digital landscape.",
            profileImage: 'assets/images/portfolio/nandani image.jpg'
        },
        contact: {
            whatsapp: '+91 9343407099',
            whatsappLink: '919343407099',
            email: 'hello@nandanigraphicano.com',
            instagram: '@nandani_graphicano',
            instagramLink: 'https://instagram.com/nandani_graphicano',
            behance: '',
            dribbble: '',
            linkedin: ''
        },
        settings: {
            siteTitle: 'Nandani Graphicano | Premium Graphic Design Studio',
            logo: 'Nandani',
            meta: 'Nandani Graphicano - High-end freelance graphic designer specializing in logos, branding, and social media designs.',
            accentColor: '#E2725B',
            year: '2026'
        },
        services: [
            { icon: 'fa-solid fa-pen-nib', name: 'Logo Design', desc: 'Memorable, minimalist, and powerful marks that define your brand\'s core essence.' },
            { icon: 'fa-solid fa-briefcase', name: 'Branding', desc: 'Complete visual identity systems including color palettes, typography, and guidelines.' },
            { icon: 'fa-brands fa-instagram', name: 'Social Media', desc: 'Engaging posts, stories, and carousels designed to boost your online presence.' },
            { icon: 'fa-solid fa-image', name: 'Thumbnail Design', desc: 'High-click-through-rate YouTube thumbnails with striking typography and effects.' },
            { icon: 'fa-solid fa-scroll', name: 'Poster Design', desc: 'Cinematic and impactful event posters, promotional flyers, and digital artwork.' },
            { icon: 'fa-solid fa-layer-group', name: 'Creative Templates', desc: 'Custom, reusable design templates for your business communications.' }
        ],
        testimonials: [
            { name: 'Sarah Jenkins', role: 'CEO, LuxeTech', quote: '"Nandani transformed our brand entirely. The dark, luxurious aesthetic she created elevated our market presence immediately. Highly recommended!"' },
            { name: 'Mark D.', role: 'Content Creator', quote: '"The thumbnails designed for my channel increased my CTR by 40%. The glowing effects and typography are just perfectly executed."' }
        ],
        stats: {
            clients: '50',
            projects: '150',
            satisfaction: '99'
        },
        projects: [
            { id: 'p1', image: 'assets/images/portfolio/advatika 1.jpeg', name: 'Advaita Agronics', tags: 'Brand Strategy, Packaging', status: 'Live', link: 'projects/advaita.html' },
            { id: 'p2', image: 'assets/images/portfolio/logo-1.png', name: 'Aura Luxe', tags: 'Logo Design, Brand Mark', status: 'Live', link: '#' },
            { id: 'p3', image: 'assets/images/portfolio/branding-1.png', name: 'Eclipse Studio', tags: 'Visual Identity, Guidelines', status: 'Live', link: '#' },
            { id: 'p4', image: 'assets/images/portfolio/social-1.png', name: 'Neon Nights', tags: 'Social Media, Campaign', status: 'Draft', link: '#' }
        ]
    },

    // Internal data cache
    _cache: null,

    // Fetch all data from API once
    async loadFromServer() {
        try {
            if (typeof supabaseClient === 'undefined') {
                console.warn("Supabase client not loaded.");
                return;
            }
            const { data, error } = await supabaseClient.from('site_data').select('data').eq('id', 1).single();
            if (error) {
                console.error("Supabase load error:", error);
            } else if (data && data.data) {
                this._cache = data.data;
            }
        } catch (e) {
            console.error("Failed to load from Supabase", e);
        }
    },

    // Get a section's data
    get(section) {
        if (this._cache && this._cache[section]) {
            return this._cache[section];
        }
        return this.defaults[section];
    },

    // Save a section's data
    async save(section, data) {
        try {
            if (typeof supabaseClient === 'undefined') {
                console.error("Supabase client not loaded.");
                return;
            }
            
            // Update local cache first
            if (!this._cache) this._cache = {};
            this._cache[section] = data;

            // Get all data to save to DB
            const allData = this.getAll();
            
            const { error } = await supabaseClient.from('site_data').upsert({ id: 1, data: allData });
            if (error) throw error;
            
        } catch (e) {
            console.error("Failed to save to Supabase", e);
        }
    },

    // Get all data
    getAll() {
        const all = {};
        Object.keys(this.defaults).forEach(key => {
            all[key] = this.get(key);
        });
        return all;
    }
};

/* ══════════════════════════════════════════════════════
   APPLY DATA TO WEBSITE PAGES
   (Only runs on index.html and project pages, not admin)
   ══════════════════════════════════════════════════════ */

function applyDataToSite() {
    // Don't run on admin page
    if (document.body.classList.contains('admin-body')) return;

    const data = SiteData.getAll();

    // ── HERO ──
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const hatchDiv = heroTitle.querySelector('.font-hatch');
        const spanEl = heroTitle.querySelector('span');
        if (hatchDiv) hatchDiv.textContent = data.hero.line1;
        if (spanEl) spanEl.textContent = data.hero.line2;
    }
    const heroSub = document.querySelector('.hero-subtitle');
    if (heroSub) heroSub.textContent = data.hero.subtitle;

    const heroCtas = document.querySelectorAll('.hero-cta .btn');
    if (heroCtas[0]) heroCtas[0].textContent = data.hero.cta1;
    if (heroCtas[1]) heroCtas[1].textContent = data.hero.cta2;

    // ── ABOUT ──
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
        const sTitle = aboutSection.querySelector('.section-title');
        const sSub = aboutSection.querySelector('.section-subtitle');
        const aboutH3 = aboutSection.querySelector('.about-text h3');
        const aboutPs = aboutSection.querySelectorAll('.about-text > p');
        
        if (sTitle) sTitle.textContent = data.about.title;
        if (sSub) sSub.textContent = data.about.subtitle;
        if (aboutH3) aboutH3.textContent = data.about.greeting;
        if (aboutPs[0]) aboutPs[0].textContent = data.about.p1;
        if (aboutPs[1]) aboutPs[1].textContent = data.about.p2;
        
        const aboutImg = document.querySelector('#about-profile-img');
        if (aboutImg && data.about.profileImage) {
            aboutImg.src = data.about.profileImage;
        }
    }

    // ── SERVICES ──
    const servicesGrid = document.querySelector('#dynamic-services-grid');
    if (servicesGrid && data.services) {
        servicesGrid.innerHTML = ''; // Clear existing
        data.services.forEach(service => {
            const card = document.createElement('div');
            card.className = 'service-card glass-panel';
            card.innerHTML = `
                <i class="${service.icon}"></i>
                <h3>${service.name}</h3>
                <p>${service.desc}</p>
            `;
            servicesGrid.appendChild(card);
        });
    }

    // ── PROJECTS ──
    const projectsGrid = document.querySelector('#dynamic-projects-grid');
    if (projectsGrid && data.projects) {
        projectsGrid.innerHTML = '';
        data.projects.forEach(project => {
            const isLive = project.status === 'Live';
            const linkHref = isLive ? project.link : '#';
            const linkTarget = isLive && project.link.startsWith('http') ? 'target="_blank"' : '';
            
            let tagsHtml = '';
            if (project.tags) {
                const tagsList = project.tags.split(',').map(t => t.trim());
                tagsHtml = tagsList.map(tag => `<span class="project-tag">${tag}</span>`).join('');
            }
            
            const card = document.createElement(isLive ? 'a' : 'div');
            card.className = 'project-card';
            if (isLive) {
                card.href = linkHref;
                if (linkTarget) card.setAttribute('target', '_blank');
            }
            
            card.innerHTML = `
                <div class="project-card-img">
                    <img src="${project.image}" alt="${project.name}">
                </div>
                <div class="project-card-info">
                    <div class="project-card-top">
                        <h3 class="project-card-title">${project.name}</h3>
                        <span class="project-card-link">${isLive ? 'View project' : 'Draft'} <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                    <div class="project-card-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // ── TESTIMONIALS ──
    const testimonialsGrid = document.querySelector('#dynamic-testimonials-grid');
    if (testimonialsGrid && data.testimonials) {
        testimonialsGrid.innerHTML = '';
        data.testimonials.forEach(testi => {
            const card = document.createElement('div');
            card.className = 'testimonial-card glass-panel';
            card.innerHTML = `
                <i class="fa-solid fa-quote-left quote-icon"></i>
                <p>"${testi.quote}"</p>
                <div class="client-info">
                    <div class="client-avatar" style="width:50px; height:50px; background:var(--color-primary-gradient); border-radius:50%;"></div>
                    <div>
                        <h4 style="font-family: var(--font-heading);">${testi.name}</h4>
                        <p style="color: var(--color-accent-gold); font-size: 0.8rem;">${testi.role}</p>
                    </div>
                </div>
            `;
            testimonialsGrid.appendChild(card);
        });
    }

    // ── CONTACT ──
    const contactLinks = document.querySelectorAll('.contact-links a');
    contactLinks.forEach(link => {
        if (link.href.includes('wa.me')) {
            link.href = 'https://wa.me/' + data.contact.whatsappLink;
            link.innerHTML = '<i class="fa-brands fa-whatsapp"></i> ' + data.contact.whatsapp;
        }
        if (link.href.includes('instagram')) {
            link.href = data.contact.instagramLink;
            link.innerHTML = '<i class="fa-brands fa-instagram"></i> ' + data.contact.instagram;
        }
        if (link.href.includes('mailto:')) {
            link.href = 'mailto:' + data.contact.email;
            link.innerHTML = '<i class="fa-regular fa-envelope"></i> ' + data.contact.email;
        }
    });

    // WhatsApp floating button
    const waFloat = document.querySelector('.floating-whatsapp');
    if (waFloat) waFloat.href = 'https://wa.me/' + data.contact.whatsappLink;

    // ── STATS ──
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length >= 3 && data.stats) {
        statNumbers[0].setAttribute('data-target', data.stats.clients);
        statNumbers[1].setAttribute('data-target', data.stats.projects);
        statNumbers[2].setAttribute('data-target', data.stats.satisfaction);
    }

    // ── SETTINGS ──
    if (data.settings.siteTitle) document.title = data.settings.siteTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && data.settings.meta) metaDesc.content = data.settings.meta;

    const logo = document.querySelector('.logo');
    if (logo && data.settings.logo) {
        logo.innerHTML = data.settings.logo + '<span>.</span>';
    }

    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear && data.settings.year) {
        footerYear.innerHTML = '&copy; ' + data.settings.year + ' Nandani Graphicano. All Rights Reserved. Crafted with passion.';
    }

    // Accent color
    if (data.settings.accentColor && data.settings.accentColor !== '#E2725B') {
        document.documentElement.style.setProperty('--color-accent-gold', data.settings.accentColor);
        const r = parseInt(data.settings.accentColor.slice(1,3), 16);
        const g = parseInt(data.settings.accentColor.slice(3,5), 16);
        const b = parseInt(data.settings.accentColor.slice(5,7), 16);
        document.documentElement.style.setProperty('--color-accent-glow', `rgba(${r},${g},${b},0.2)`);
        document.documentElement.style.setProperty('--color-primary-gradient', `linear-gradient(135deg, ${data.settings.accentColor} 0%, ${data.settings.accentColor}cc 100%)`);
    }
}

// Auto-apply when page loads (script is deferred so DOM is ready)
SiteData.loadFromServer().then(() => {
    applyDataToSite();
});
