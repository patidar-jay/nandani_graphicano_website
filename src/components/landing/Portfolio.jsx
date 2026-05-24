import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Portfolio({ data }) {
    const portfolioRef = useRef(null);
    const itemsRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((el) => {
                if (el) {
                    gsap.from(el, {
                        y: 60,
                        opacity: 0,
                        duration: 1.2,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%"
                        }
                    });
                }
            });
        }, portfolioRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={portfolioRef} id="portfolio" style={{ padding: '8rem 5%', background: 'var(--card)' }}>
            <h2 className="section-title">Design <span>Work</span></h2>
            <p className="section-subtitle">Selected projects — brand identities, packaging, and visual systems crafted to make brands unforgettable.</p>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '3rem',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                {data.map((proj, index) => {
                    const slug = proj.slug || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    return (
                    <Link 
                        key={index} 
                        to={`/project/${slug}`}
                        ref={el => itemsRef.current[index] = el} 
                        style={{
                            position: 'relative',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: '1px solid var(--border)',
                            textDecoration: 'none',
                            display: 'block'
                        }}
                    >
                        <div style={{ overflow: 'hidden' }}>
                            <img src={proj.image} alt={proj.title} style={{
                                width: '100%',
                                height: '350px',
                                objectFit: 'cover',
                                display: 'block',
                                transition: 'transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)'
                            }} 
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                const overlay = e.currentTarget.parentElement.querySelector('.proj-overlay');
                                if (overlay) overlay.style.opacity = '1';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                const overlay = e.currentTarget.parentElement.querySelector('.proj-overlay');
                                if (overlay) overlay.style.opacity = '0';
                            }}/>
                            <div className="proj-overlay" style={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(to top, rgba(255,255,255,0.95), rgba(255,255,255,0.2))',
                                opacity: 0,
                                transition: 'opacity 0.4s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                padding: '3rem 2rem',
                                pointerEvents: 'none'
                            }}>
                                <span style={{ color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                                    {proj.category}
                                </span>
                                <h3 style={{ color: 'var(--text)', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>
                                    {proj.title}
                                </h3>
                                <span style={{ 
                                    marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                                    fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent)'
                                }}>
                                    View Project <i className="fa-solid fa-arrow-right"></i>
                                </span>
                            </div>
                        </div>
                    </Link>
                    );
                })}
            </div>
        </section>
    );
}
