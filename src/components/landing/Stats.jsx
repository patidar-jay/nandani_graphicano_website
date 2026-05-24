import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Stats() {
    const sectionRef = useRef(null);
    const numsRef = useRef([]);
    const cardsRef = useRef([]);
    const underlinesRef = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── stagger each stat card in ── */
            gsap.fromTo(
                cardsRef.current,
                { opacity: 0, y: 60, scale: 0.92 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.9,
                    ease: 'power3.out',
                    stagger: 0.18,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                }
            );

            /* ── counter animation per number ── */
            numsRef.current.forEach((el) => {
                if (!el) return;
                const target = parseInt(el.getAttribute('data-target'));
                const obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2.8,
                    ease: 'power2.out',
                    snap: { val: 1 },
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    },
                    onUpdate: () => {
                        el.textContent = Math.round(obj.val);
                    },
                });
            });

            /* ── gradient underlines slide in ── */
            gsap.fromTo(
                underlinesRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1,
                    duration: 1,
                    ease: 'power3.out',
                    stagger: 0.18,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 75%',
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    const stats = [
        { label: 'Happy Clients', value: 50, suffix: '+' },
        { label: 'Projects Completed', value: 150, suffix: '+' },
        { label: 'Satisfaction Rate', value: 99, suffix: '%' },
    ];

    return (
        <section
            ref={sectionRef}
            id="stats"
            style={{
                padding: '7rem 5%',
                background:
                    'linear-gradient(135deg, rgba(255,154,139,0.04) 0%, rgba(255,106,136,0.06) 50%, rgba(255,153,172,0.04) 100%)',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* ambient decorative glow */}
            <div
                style={{
                    position: 'absolute',
                    top: '-40%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '700px',
                    height: '700px',
                    background:
                        'radial-gradient(circle, rgba(255,106,136,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0,
                }}
            />

            <div
                style={{
                    maxWidth: '1100px',
                    margin: '0 auto',
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    gap: '3rem',
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        ref={(el) => (cardsRef.current[index] = el)}
                        style={{
                            textAlign: 'center',
                            opacity: 0,
                            minWidth: '200px',
                        }}
                    >
                        {/* number + suffix row */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'center',
                                gap: '2px',
                                marginBottom: '0.75rem',
                            }}
                        >
                            <h3
                                ref={(el) => (numsRef.current[index] = el)}
                                data-target={stat.value}
                                style={{
                                    fontSize: '4.2rem',
                                    fontFamily: 'var(--font-heading)',
                                    background: 'var(--accent-gradient)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    lineHeight: 1,
                                    margin: 0,
                                    fontWeight: 700,
                                }}
                            >
                                0
                            </h3>
                            <span
                                style={{
                                    fontSize: '2rem',
                                    fontFamily: 'var(--font-heading)',
                                    background: 'var(--accent-gradient)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    fontWeight: 600,
                                }}
                            >
                                {stat.suffix}
                            </span>
                        </div>

                        {/* label */}
                        <p
                            style={{
                                fontWeight: 400,
                                textTransform: 'uppercase',
                                letterSpacing: '2.5px',
                                color: 'var(--muted)',
                                fontSize: '0.8rem',
                                marginBottom: '0.9rem',
                            }}
                        >
                            {stat.label}
                        </p>

                        {/* gradient underline */}
                        <div
                            ref={(el) => (underlinesRef.current[index] = el)}
                            style={{
                                width: '48px',
                                height: '3px',
                                margin: '0 auto',
                                background: 'var(--accent-gradient)',
                                borderRadius: '4px',
                                transformOrigin: 'center',
                                transform: 'scaleX(0)',
                            }}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
