import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Testimonials({ data }) {
    const sectionRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.testimonials-title', {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.testimonials-title',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.from('.testimonials-subtitle', {
                opacity: 0,
                y: 40,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.testimonials-subtitle',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.from('.testimonial-card', {
                opacity: 0,
                y: 60,
                duration: 0.9,
                stagger: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.fromTo('.quote-icon', {
                scale: 0.7,
                opacity: 0
            }, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: 'elastic.out(1, 0.5)',
                scrollTrigger: {
                    trigger: '.testimonials-grid',
                    start: 'top 75%',
                    toggleActions: 'play none none none'
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [data]);

    return (
        <section
            ref={sectionRef}
            id="testimonials"
            style={{ padding: '8rem 5%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
        >
            <h2 className="section-title testimonials-title">Client <span>Praise</span></h2>
            <p className="section-subtitle testimonials-subtitle">What others say about the Nandani Graphicano experience.</p>

            <div
                className="testimonials-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '3rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                {data.map((test, index) => {
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className="glass-panel testimonial-card"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                padding: '4rem 3rem',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease, border-color 0.5s ease',
                                transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                                boxShadow: isHovered
                                    ? '0 25px 60px rgba(var(--accent-rgb), 0.1), 0 8px 20px rgba(0,0,0,0.05)'
                                    : undefined,
                                borderColor: isHovered ? 'rgba(var(--accent-rgb), 0.25)' : undefined,
                                cursor: 'default'
                            }}
                        >
                            {/* Animated gradient border top */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '2px',
                                background: 'var(--accent-gradient)',
                                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                                transformOrigin: 'center',
                                transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }} />

                            {/* Quote icon with pulse class */}
                            <i className="fa-solid fa-quote-left quote-icon" style={{
                                position: 'absolute',
                                top: '2rem',
                                left: '2rem',
                                fontSize: '4rem',
                                backgroundImage: isHovered 
                                    ? 'linear-gradient(135deg, rgba(var(--accent-rgb),0.15) 0%, rgba(var(--accent-rgb),0.08) 100%)'
                                    : 'transparent',
                                WebkitBackgroundClip: 'text',
                                color: isHovered ? 'rgba(var(--accent-rgb), 0.15)' : 'var(--border)',
                                transition: 'color 0.4s ease',
                                zIndex: 0
                            }}></i>

                            {/* Testimonial text */}
                            <p style={{
                                fontSize: '1.2rem',
                                lineHeight: 1.8,
                                color: 'var(--text)',
                                fontStyle: 'italic',
                                marginBottom: '2rem',
                                position: 'relative',
                                zIndex: 1
                            }}>"{test.text}"</p>

                            {/* Author info */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
                                {/* Avatar initial circle */}
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: isHovered
                                        ? 'linear-gradient(135deg, rgba(255,154,139,0.2) 0%, rgba(255,106,136,0.15) 100%)'
                                        : 'var(--accent-glow)',
                                    border: isHovered
                                        ? '2px solid var(--accent)'
                                        : '1px solid var(--accent)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)',
                                    fontWeight: 600,
                                    fontSize: '1.5rem',
                                    fontFamily: 'var(--font-heading)',
                                    transition: 'background 0.4s ease, border 0.4s ease, transform 0.4s ease',
                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                    flexShrink: 0
                                }}>
                                    {(test.author || 'C').charAt(0).toUpperCase()}
                                </div>

                                <div>
                                    <h4 style={{
                                        fontFamily: 'var(--font-heading)',
                                        color: 'var(--text)',
                                        fontSize: '1.2rem',
                                        letterSpacing: '0.5px',
                                        marginBottom: '0.2rem'
                                    }}>
                                        {test.author || 'Client'}
                                    </h4>
                                    <span style={{
                                        color: 'var(--muted)',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        {test.company}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
