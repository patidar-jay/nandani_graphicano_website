import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Services({ data }) {
    const sectionRef = useRef(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from('.services-title', {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.services-title',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.from('.services-subtitle', {
                opacity: 0,
                y: 40,
                duration: 1,
                delay: 0.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.services-subtitle',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            });

            gsap.from('.service-card', {
                opacity: 0,
                y: 60,
                duration: 0.9,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '.services-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [data]);

    return (
        <section
            ref={sectionRef}
            id="services"
            style={{ padding: '8rem 5%', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}
        >
            <h2 className="section-title services-title">Premium <span>Services</span></h2>
            <p className="section-subtitle services-subtitle">Comprehensive design solutions tailored for high-end brands.</p>

            <div
                className="services-grid"
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '3rem',
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                {data.map((srv, index) => {
                    const isHovered = hoveredIndex === index;
                    const cardNumber = String(index + 1).padStart(2, '0');

                    return (
                        <div
                            key={index}
                            className="glass-panel service-card"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            style={{
                                padding: '3rem 2.5rem',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.4s ease',
                                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                                boxShadow: isHovered
                                    ? '0 25px 60px rgba(255, 106, 136, 0.12), 0 8px 20px rgba(0,0,0,0.06)'
                                    : undefined,
                                cursor: 'default'
                            }}
                        >
                            {/* Gradient line at top */}
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'var(--accent-gradient)',
                                transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
                                transformOrigin: 'left center',
                                transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                            }} />

                            {/* Number overlay */}
                            <span style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1.5rem',
                                fontFamily: 'var(--font-heading)',
                                fontSize: '4rem',
                                fontWeight: 700,
                                color: 'var(--text)',
                                opacity: isHovered ? 0.08 : 0.04,
                                lineHeight: 1,
                                transition: 'opacity 0.4s ease',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }}>
                                {cardNumber}
                            </span>

                            {/* Icon */}
                            <div style={{
                                width: '60px',
                                height: '60px',
                                background: isHovered
                                    ? 'linear-gradient(135deg, rgba(255,154,139,0.2) 0%, rgba(255,106,136,0.15) 100%)'
                                    : 'var(--accent-glow)',
                                color: 'var(--accent)',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.8rem',
                                marginBottom: '2rem',
                                border: '1px solid rgba(255, 106, 136, 0.15)',
                                transition: 'background 0.4s ease, transform 0.4s ease',
                                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                <i className={`fa-solid ${srv.icon}`}></i>
                            </div>

                            {/* Title */}
                            <h3 style={{
                                fontFamily: 'var(--font-heading)',
                                fontSize: '1.8rem',
                                marginBottom: '1rem',
                                color: 'var(--text)',
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {srv.title}
                            </h3>

                            {/* Description */}
                            <p style={{
                                color: 'var(--muted)',
                                lineHeight: 1.7,
                                position: 'relative',
                                zIndex: 1
                            }}>
                                {srv.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
