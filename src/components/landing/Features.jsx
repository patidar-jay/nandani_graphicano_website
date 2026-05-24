import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
    const sectionRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const cardsRef = useRef([]);
    const iconsRef = useRef([]);
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── section title slide-up + fade ── */
            gsap.fromTo(
                titleRef.current,
                { opacity: 0, y: 40 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 82%',
                    },
                }
            );

            gsap.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 25 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 82%',
                    },
                }
            );

            /* ── staggered card reveal ── */
            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 70, scale: 0.9 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.85,
                    ease: 'power3.out',
                    stagger: 0.14,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 72%',
                    },
                }
            );

            /* ── icon rotate + scale entrance ── */
            gsap.fromTo(
                iconsRef.current,
                { opacity: 0, scale: 0.4, rotation: -60 },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 0.9,
                    ease: 'back.out(1.7)',
                    stagger: 0.14,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 72%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const features = [
        {
            icon: 'fa-solid fa-wand-magic-sparkles',
            title: 'Creative Designs',
            desc: 'Unique, out-of-the-box concepts that captivate.',
        },
        {
            icon: 'fa-solid fa-bolt',
            title: 'Fast Delivery',
            desc: 'Rapid turnaround without compromising quality.',
        },
        {
            icon: 'fa-solid fa-gem',
            title: 'Modern Aesthetics',
            desc: 'Staying ahead with ultra-premium design trends.',
        },
        {
            icon: 'fa-solid fa-star',
            title: 'Pro Quality',
            desc: 'Pixel-perfect execution in every single detail.',
        },
    ];

    return (
        <section
            ref={sectionRef}
            id="why-me"
            style={{ padding: '7rem 5%', position: 'relative', overflow: 'hidden' }}
        >
            {/* ambient glow */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-30%',
                    right: '-10%',
                    width: '500px',
                    height: '500px',
                    background:
                        'radial-gradient(circle, rgba(255,106,136,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <h2
                ref={titleRef}
                className="section-title"
                style={{ opacity: 0 }}
            >
                Value <span>Proposition</span>
            </h2>
            <p
                ref={subtitleRef}
                className="section-subtitle"
                style={{ opacity: 0 }}
            >
                Why elite brands trust Nandani Graphicano.
            </p>

            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '2rem',
                    maxWidth: '1200px',
                    margin: '0 auto',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {features.map((feature, index) => {
                    const isHovered = hoveredIndex === index;
                    return (
                        <div
                            key={index}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="glass-panel"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                            style={{
                                padding: '3rem 2rem',
                                textAlign: 'center',
                                opacity: 0,
                                cursor: 'default',
                                transition:
                                    'transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.4s ease',
                                transform: isHovered
                                    ? 'translateY(-8px)'
                                    : 'translateY(0)',
                                boxShadow: isHovered
                                    ? '0 20px 50px rgba(255,106,136,0.12), 0 8px 20px rgba(0,0,0,0.04)'
                                    : '0 4px 20px rgba(0,0,0,0.03)',
                                borderColor: isHovered
                                    ? 'rgba(255,106,136,0.18)'
                                    : undefined,
                            }}
                        >
                            {/* icon circle */}
                            <div
                                ref={(el) => (iconsRef.current[index] = el)}
                                style={{
                                    width: '74px',
                                    height: '74px',
                                    margin: '0 auto 1.8rem auto',
                                    background: isHovered
                                        ? 'linear-gradient(135deg, rgba(255,154,139,0.18) 0%, rgba(255,106,136,0.18) 100%)'
                                        : 'var(--accent-glow)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--accent)',
                                    fontSize: '1.8rem',
                                    border: '1px solid rgba(255,106,136,0.15)',
                                    transition:
                                        'background 0.35s ease, transform 0.35s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    opacity: 0,
                                }}
                            >
                                <i className={feature.icon} />
                            </div>

                            <h3
                                style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '0.5rem',
                                    color: 'var(--text)',
                                    fontFamily: 'var(--font-heading)',
                                    fontWeight: 600,
                                    transition: 'color 0.3s ease',
                                }}
                            >
                                {feature.title}
                            </h3>

                            {/* gradient accent bar */}
                            <div
                                style={{
                                    width: isHovered ? '40px' : '24px',
                                    height: '3px',
                                    background: 'var(--accent-gradient)',
                                    borderRadius: '4px',
                                    margin: '0 auto 1rem auto',
                                    transition: 'width 0.4s ease',
                                }}
                            />

                            <p
                                style={{
                                    color: 'var(--muted)',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.7,
                                }}
                            >
                                {feature.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
