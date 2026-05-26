import React, { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CustomCursor from '../components/common/CustomCursor';
import { useAnalytics } from '../hooks/useAnalytics';

gsap.registerPlugin(ScrollTrigger);

// Only Advaita Agronics has a full case study with multiple images
const projectsData = {
    'advaita-agronics': {
        label: '01',
        category: 'Brand Identity & Packaging',
        title: 'Advaita',
        titleHighlight: 'Agronics',
        intro: 'A complete brand identity and packaging system for an organic agronomy brand — rooted in tradition, designed for the modern shelf.',
        client: 'Advaita Agronics',
        year: '2024',
        industry: 'Organic Food',
        tags: ['Brand Strategy', 'Visual Identity', 'Packaging Design', 'Logo Design'],
        heroImage: '/assets/images/portfolio/advatika 1.jpeg',
        sections: [
            {
                type: 'wide-image',
                image: '/assets/images/portfolio/advatika 3.jpeg',
                alt: 'Advaita Agronics Logo System'
            },
            {
                type: 'story',
                challenge: [
                    'Advaita Agronics approached us to build a premium organic food brand from the ground up. They needed an identity that communicates purity, tradition, and trustworthiness — while standing out on crowded retail shelves.',
                    'The brand\'s Hindi roots ("Advaita" = non-dual / oneness) needed to be woven into a modern visual language that resonates with both rural farmers and urban consumers seeking authentic organic products.'
                ],
                solution: [
                    'We designed a logo mark inspired by the Devanagari letter "अ" (A) encircled by a wreath of organic leaves — symbolizing purity, nature, and unity. The earthy green and warm gold palette evokes trust and quality.',
                    'The packaging system covers their full product line — Oyster Mushroom Spread, Pickle, and Fresh Mushroom — each with a distinctive yet cohesive visual identity that feels premium on any shelf.'
                ]
            },
            {
                type: 'showcase-image',
                image: '/assets/images/portfolio/advatika 2.jpeg',
                alt: 'Advaita Agronics Logo Mark'
            },
            {
                type: 'gallery',
                title: 'Packaging Design',
                subtitle: 'Product packaging designed to feel premium, organic, and shelf-ready.',
                images: [
                    '/assets/images/portfolio/advatika 4.jpeg',
                    '/assets/images/portfolio/advatika 5.jpeg'
                ]
            },
            {
                type: 'full-image',
                image: '/assets/images/portfolio/advatika 6.jpeg',
                alt: 'Advaita Agronics Brand Pattern'
            }
        ],
        results: [
            { value: '100%', label: 'Organic Identity' },
            { value: '3+', label: 'Product Lines' },
            { value: 'Premium', label: 'Market Positioning' }
        ]
    },
    'social-media-post': {
        label: '02',
        category: 'Social Media',
        title: 'Social',
        titleHighlight: 'Media',
        intro: 'Engaging, high-conversion social media post designs tailored for brand awareness and audience interaction.',
        client: 'Confidential',
        year: '2024',
        industry: 'Marketing',
        tags: ['Instagram', 'Facebook', 'Content Design', 'Engagement'],
        heroImage: '/assets/images/portfolio/social-1.png',
        sections: [],
        results: [
            { value: '3x', label: 'Engagement Rate' },
            { value: '50K+', label: 'Impressions' },
            { value: 'Viral', label: 'Content Reach' }
        ]
    },
    'premium-logo': {
        label: '03',
        category: 'Brand Identity',
        title: 'Premium',
        titleHighlight: 'Logo',
        intro: 'A minimal, timeless, and versatile logo design crafted to establish a strong brand presence.',
        client: 'Confidential',
        year: '2024',
        industry: 'Luxury',
        tags: ['Logo Design', 'Typography', 'Minimalism'],
        heroImage: '/assets/images/portfolio/logo-1.png',
        sections: [],
        results: [
            { value: 'Timeless', label: 'Design Approach' },
            { value: 'Multi', label: 'Platform Versatility' },
            { value: '100%', label: 'Brand Recognition' }
        ]
    },
    'brand-guidelines': {
        label: '04',
        category: 'Brand Strategy',
        title: 'Brand',
        titleHighlight: 'Guidelines',
        intro: 'Comprehensive brand guidelines ensuring consistency across all visual touchpoints and marketing channels.',
        client: 'Confidential',
        year: '2024',
        industry: 'Corporate',
        tags: ['Brand Book', 'Typography', 'Color Palette', 'Rules'],
        heroImage: '/assets/images/portfolio/guidelines-1.png',
        sections: [],
        results: [
            { value: '50+', label: 'Pages of Guidelines' },
            { value: '100%', label: 'Brand Consistency' },
            { value: 'Complete', label: 'Visual System' }
        ]
    },
    'corporate-assets': {
        label: '05',
        category: 'Print Design',
        title: 'Corporate',
        titleHighlight: 'Assets',
        intro: 'Professional business stationery and corporate collateral designed to make a lasting impression.',
        client: 'Confidential',
        year: '2024',
        industry: 'Business',
        tags: ['Business Card', 'Letterhead', 'Stationery', 'Print Design'],
        heroImage: '/assets/images/portfolio/business-1.png',
        sections: [],
        results: [
            { value: '5+', label: 'Collateral Items' },
            { value: 'Premium', label: 'Print Finishes' },
            { value: '100%', label: 'Client Satisfaction' }
        ]
    },
    'event-poster': {
        label: '06',
        category: 'Marketing',
        title: 'Event',
        titleHighlight: 'Poster',
        intro: 'A vibrant and attention-grabbing poster design that drives engagement and attendance.',
        client: 'Confidential',
        year: '2024',
        industry: 'Events',
        tags: ['Poster Design', 'Marketing', 'Print'],
        heroImage: '/assets/images/portfolio/poster-1.png',
        sections: [],
        results: [
            { value: 'High', label: 'Visual Impact' },
            { value: 'Multi', label: 'Format Ready' },
            { value: '100%', label: 'Engagement' }
        ]
    },
    'instagram-grid': {
        label: '07',
        category: 'Social Media',
        title: 'Instagram',
        titleHighlight: 'Grid',
        intro: 'A cohesive Instagram grid design that elevates the brand\'s social media presence.',
        client: 'Confidential',
        year: '2024',
        industry: 'Lifestyle',
        tags: ['Instagram', 'Grid Design', 'Aesthetics'],
        heroImage: '/assets/images/portfolio/grid-1.png',
        sections: [],
        results: [
            { value: '9', label: 'Post Layout' },
            { value: 'Seamless', label: 'Visual Flow' },
            { value: 'Aesthetic', label: 'Brand Vibe' }
        ]
    },
    'product-packaging': {
        label: '08',
        category: 'Packaging',
        title: 'Product',
        titleHighlight: 'Packaging',
        intro: 'Innovative and sustainable product packaging designed to stand out on the shelf.',
        client: 'Confidential',
        year: '2024',
        industry: 'Retail',
        tags: ['Packaging', '3D Mockup', 'Print Design'],
        heroImage: '/assets/images/portfolio/packaging-1.png',
        sections: [],
        results: [
            { value: 'Eco', label: 'Friendly Materials' },
            { value: 'Bold', label: 'Shelf Presence' },
            { value: '100%', label: 'Print Ready' }
        ]
    },
    'web-template': {
        label: '09',
        category: 'UI/UX',
        title: 'Web',
        titleHighlight: 'Template',
        intro: 'A modern, responsive web template designed for maximum usability and visual appeal.',
        client: 'Confidential',
        year: '2024',
        industry: 'Technology',
        tags: ['UI Design', 'Web Design', 'Responsive'],
        heroImage: '/assets/images/portfolio/template-1.png',
        sections: [],
        results: [
            { value: 'Modern', label: 'Design System' },
            { value: 'Responsive', label: 'All Devices' },
            { value: 'Fast', label: 'Load Times' }
        ]
    },
    'viral-thumbnail': {
        label: '10',
        category: 'YouTube',
        title: 'Viral',
        titleHighlight: 'Thumbnail',
        intro: 'Eye-catching YouTube thumbnails designed to maximize click-through rates and views.',
        client: 'Confidential',
        year: '2024',
        industry: 'Content Creation',
        tags: ['Thumbnail Design', 'YouTube', 'Content Creation'],
        heroImage: '/assets/images/portfolio/thumbnail-1.png',
        sections: [],
        results: [
            { value: '2x', label: 'CTR Improvement' },
            { value: 'Bold', label: 'Visual Impact' },
            { value: '10+', label: 'Thumbnails Delivered' }
        ]
    }
};

export default function ProjectDetail() {
    const { slug } = useParams();
    const project = projectsData[slug];

    useAnalytics();

    const heroTextRef = useRef(null);
    const heroImgRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    useEffect(() => {
        if (!project) return;

        const ctx = gsap.context(() => {
            gsap.from(heroTextRef.current, { opacity: 0, x: -50, duration: 1.2, ease: 'power3.out', delay: 0.3 });
            gsap.from(heroImgRef.current, { opacity: 0, x: 50, duration: 1.2, ease: 'power3.out', delay: 0.5 });

            gsap.utils.toArray('.proj-animate').forEach(el => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                    opacity: 0, y: 50, duration: 0.9, ease: 'power2.out'
                });
            });

            gsap.utils.toArray('.proj-story-block').forEach((el, i) => {
                gsap.from(el, {
                    scrollTrigger: { trigger: el, start: 'top 80%' },
                    opacity: 0, y: 40, duration: 0.8, delay: i * 0.15, ease: 'power2.out'
                });
            });
        });

        return () => ctx.revert();
    }, [project]);

    if (!project) {
        return (
            <>
                <CustomCursor />
                <Header />
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '2rem' }}>
                    <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--text)' }}>Project Not Found</h1>
                    <Link to="/#portfolio" style={{ color: 'var(--accent)', textDecoration: 'none', fontSize: '1.1rem' }}>
                        <i className="fa-solid fa-arrow-left"></i> Back to Portfolio
                    </Link>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <CustomCursor />
            <Header />
            <main id={`Project - ${project.title}`} style={{ paddingTop: '100px' }}>

                {/* Back Navigation */}
                <section style={{ padding: '2rem 5%' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <Link to="/#portfolio" style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                            color: 'var(--muted)', textDecoration: 'none', fontSize: '0.95rem',
                            transition: 'color 0.3s', fontWeight: 500
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}>
                            <i className="fa-solid fa-arrow-left"></i>
                            <span>Back to Portfolio</span>
                        </Link>
                    </div>
                </section>

                {/* Project Hero */}
                <section style={{ padding: '3rem 5% 5rem' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
                        <div ref={heroTextRef} style={{ flex: '1 1 400px' }}>
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                                marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '3px'
                            }}>
                                <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700 }}>{project.label}</span>
                                {project.category}
                            </div>
                            <h1 style={{
                                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                                color: 'var(--text)', lineHeight: 1.1, marginBottom: '1.5rem'
                            }}>
                                {project.title}<br />
                                <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>
                                    {project.titleHighlight}
                                </span>
                            </h1>
                            <p style={{ color: 'var(--muted)', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: '2.5rem', maxWidth: '550px' }}>
                                {project.intro}
                            </p>
                            <div style={{ display: 'flex', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                                {[
                                    { label: 'Client', value: project.client },
                                    { label: 'Year', value: project.year },
                                    { label: 'Industry', value: project.industry }
                                ].map(m => (
                                    <div key={m.label}>
                                        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--muted)', marginBottom: '0.3rem' }}>{m.label}</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)' }}>{m.value}</div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                                {project.tags.map(tag => (
                                    <span key={tag} style={{
                                        padding: '0.5rem 1.2rem', borderRadius: '50px', fontSize: '0.8rem',
                                        background: 'rgba(255,154,139,0.08)', color: 'var(--accent)', fontWeight: 600,
                                        border: '1px solid rgba(255,154,139,0.15)'
                                    }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div ref={heroImgRef} className="glass-panel" style={{ flex: '1 1 400px', borderRadius: '20px', overflow: 'hidden', padding: '0.5rem' }}>
                            <img src={project.heroImage} alt={project.title} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
                        </div>
                    </div>
                </section>

                {/* Dynamic Sections — only render if they exist */}
                {project.sections.map((section, idx) => {
                    if (section.type === 'wide-image') {
                        return (
                            <section key={idx} style={{ padding: '3rem 5%' }}>
                                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                    <div className="glass-panel proj-animate" style={{ borderRadius: '20px', overflow: 'hidden', padding: '0.5rem' }}>
                                        <img src={section.image} alt={section.alt} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    if (section.type === 'story') {
                        return (
                            <section key={idx} style={{ padding: '5rem 5%' }}>
                                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem' }}>
                                    <div className="proj-story-block">
                                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.3, marginBottom: '1rem' }}>01</div>
                                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1.5rem' }}>The Challenge</h2>
                                        {section.challenge.map((p, i) => (
                                            <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>{p}</p>
                                        ))}
                                    </div>
                                    <div className="proj-story-block">
                                        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', opacity: 0.3, marginBottom: '1rem' }}>02</div>
                                        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--text)', marginBottom: '1.5rem' }}>The Solution</h2>
                                        {section.solution.map((p, i) => (
                                            <p key={i} style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem', fontSize: '1.05rem' }}>{p}</p>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    if (section.type === 'showcase-image') {
                        return (
                            <section key={idx} style={{ padding: '3rem 5%' }}>
                                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                                    <div className="glass-panel proj-animate" style={{ borderRadius: '20px', overflow: 'hidden', padding: '0.5rem' }}>
                                        <img src={section.image} alt={section.alt} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    if (section.type === 'gallery') {
                        return (
                            <section key={idx} style={{ padding: '5rem 5%' }}>
                                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--text)', marginBottom: '0.8rem' }}>
                                        {section.title}
                                    </h2>
                                    <p style={{ textAlign: 'center', color: 'var(--muted)', marginBottom: '3rem', fontSize: '1.05rem' }}>
                                        {section.subtitle}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                        {section.images.map((img, i) => (
                                            <div key={i} className="glass-panel proj-animate" style={{ borderRadius: '20px', overflow: 'hidden', padding: '0.5rem' }}>
                                                <img src={img.src} alt={img.alt} style={{ width: '100%', borderRadius: '16px', display: 'block' }} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </section>
                        );
                    }
                    return null;
                })}

                {/* Results */}
                <section style={{ padding: '5rem 5%' }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="glass-panel proj-animate" style={{ padding: '3.5rem', borderRadius: '24px' }}>
                            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', textAlign: 'center', color: 'var(--text)', marginBottom: '3rem' }}>The Results</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2rem', textAlign: 'center' }}>
                                {project.results.map((r, i) => (
                                    <div key={i}>
                                        <h3 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-heading)', background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                                            {r.value}
                                        </h3>
                                        <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>{r.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section style={{ padding: '4rem 5% 6rem', textAlign: 'center' }}>
                    <p style={{ color: 'var(--muted)', fontSize: '1rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>Explore More Work</p>
                    <Link to="/#portfolio" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                        fontSize: '1.3rem', color: 'var(--text)', textDecoration: 'none',
                        fontFamily: 'var(--font-heading)', transition: 'color 0.3s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#FF6A88'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                        View All Projects <i className="fa-solid fa-arrow-right"></i>
                    </Link>
                </section>

            </main>
            <Footer />
        </>
    );
}
