import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Hero({ data }) {
    const sectionRef = useRef(null);
    const bgRef = useRef(null);
    const overlayRef = useRef(null);

    const titleLinesRef = useRef([]);
    const subtitleRef = useRef(null);
    const btn1Ref = useRef(null);
    const orb1Ref = useRef(null);
    const orb2Ref = useRef(null);
    const orb3Ref = useRef(null);

    const titleText = data?.title || 'Graphic Designer';
    const titleLines = titleText.split('\n');

    useEffect(() => {
        const ctx = gsap.context(() => {
            /* ── master timeline ── */
            const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

            /* ── 1. CREATIVE label – typewriter / clipPath reveal ── */
            tl.fromTo(

                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.2, ease: 'power3.inOut' },
                0.15
            );

            /* ── 2. Title lines stagger ── */
            titleLinesRef.current.forEach((line, i) => {
                if (!line) return;
                tl.fromTo(
                    line,
                    { y: 120, opacity: 0, rotateX: 18, transformOrigin: 'left bottom' },
                    { y: 0, opacity: 1, rotateX: 0, duration: 1.4, ease: 'power4.out' },
                    0.35 + i * 0.18
                );
            });

            /* ── 3. Subtitle clipPath reveal from left ── */
            tl.fromTo(
                subtitleRef.current,
                { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
                { clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.3, ease: 'power3.inOut' },
                0.9
            );

            /* ── 4. Buttons stagger in individually ── */
            tl.fromTo(
                btn1Ref.current,
                { y: 50, opacity: 0, scale: 0.92 },
                { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.4)' },
                1.2
            );

            /* ── 5. Floating decorative orbs – infinite timeline ── */
            const orbTl = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut' } });
            orbTl
                .to(orb1Ref.current, { y: -22, x: 10, scale: 1.08, duration: 4.5 }, 0)
                .to(orb2Ref.current, { y: 18, x: -14, scale: 0.92, duration: 5.2 }, 0)
                .to(orb3Ref.current, { y: -16, x: 8, scale: 1.05, duration: 3.8 }, 0);

            /* subtle pulse opacity */
            gsap.to(orb1Ref.current, { opacity: 0.55, repeat: -1, yoyo: true, duration: 3, ease: 'sine.inOut' });
            gsap.to(orb2Ref.current, { opacity: 0.45, repeat: -1, yoyo: true, duration: 4, ease: 'sine.inOut', delay: 1 });
            gsap.to(orb3Ref.current, { opacity: 0.5, repeat: -1, yoyo: true, duration: 3.5, ease: 'sine.inOut', delay: 0.5 });

            /* ── 6. Parallax on background via ScrollTrigger ── */
            gsap.to(bgRef.current, {
                yPercent: 25,
                ease: 'none',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 0.6,
                },
            });

            /* slight overlay fade-in for depth */
            gsap.fromTo(
                overlayRef.current,
                { opacity: 0.85 },
                {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: true,
                    },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    /* ── shared orb base style ── */
    const orbBase = {
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(60px)',
        pointerEvents: 'none',
        zIndex: 0,
        willChange: 'transform, opacity',
    };

    return (
        <section
            ref={sectionRef}
            id="hero"
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                padding: '0 5%',
                overflow: 'hidden',
            }}
        >
            {/* ── Parallax BG layer ── */}
            <div
                ref={bgRef}
                style={{
                    position: 'absolute',
                    inset: '-20% 0',
                    backgroundImage: `url('${data?.bgImage || '/assets/images/hero-bg.png'}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                    willChange: 'transform',
                }}
            />

            {/* ── Soft Light Overlay ── */}
            <div
                ref={overlayRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(135deg, rgba(250,250,250,0.97) 0%, rgba(250,250,250,0.6) 50%, rgba(250,250,250,0.4) 100%)',
                    zIndex: 1,
                }}
            />

            {/* ── Floating decorative orbs ── */}
            <div
                ref={orb1Ref}
                style={{
                    ...orbBase,
                    width: '340px',
                    height: '340px',
                    background: 'radial-gradient(circle, rgba(255,154,139,0.35) 0%, rgba(255,106,136,0.08) 70%, transparent 100%)',
                    top: '10%',
                    right: '8%',
                    opacity: 0.7,
                }}
            />
            <div
                ref={orb2Ref}
                style={{
                    ...orbBase,
                    width: '260px',
                    height: '260px',
                    background: 'radial-gradient(circle, rgba(255,153,172,0.3) 0%, rgba(255,154,139,0.06) 70%, transparent 100%)',
                    bottom: '15%',
                    left: '5%',
                    opacity: 0.6,
                }}
            />
            <div
                ref={orb3Ref}
                style={{
                    ...orbBase,
                    width: '180px',
                    height: '180px',
                    background: 'radial-gradient(circle, rgba(255,106,136,0.25) 0%, rgba(255,154,139,0.05) 70%, transparent 100%)',
                    top: '55%',
                    right: '30%',
                    opacity: 0.55,
                }}
            />

            {/* ── Content ── */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2, width: '100%' }}>


                {/* Title – each line animates separately */}
                <h1
                    style={{
                        fontFamily: 'var(--font-hatch)',
                        fontSize: 'clamp(3rem, 8vw, 6rem)',
                        color: 'var(--text)',
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        letterSpacing: '-1px',
                    }}
                >
                    {titleLines.map((line, i) => (
                        <span
                            key={i}
                            ref={(el) => (titleLinesRef.current[i] = el)}
                            style={{
                                display: 'block',
                                opacity: 0,
                                perspective: '600px',
                                overflow: 'hidden',
                            }}
                        >
                            {line}
                        </span>
                    ))}
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    style={{
                        color: 'var(--muted)',
                        fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                        maxWidth: '600px',
                        marginBottom: '3rem',
                        lineHeight: 1.8,
                        fontWeight: 300,
                        opacity: 0,
                    }}
                >
                    {data?.subtitle || 'Logos, Branding, Social Media Designs & Creative Visual Experiences.'}
                </p>

                {/* Buttons */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <a
                        ref={btn1Ref}
                        href="#portfolio"
                        style={{
                            padding: '1.2rem 3rem',
                            background: 'var(--accent-gradient)',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '50px',
                            fontWeight: 600,
                            letterSpacing: '1px',
                            transition: 'all 0.35s cubic-bezier(0.165,0.84,0.44,1)',
                            boxShadow: '0 10px 30px rgba(var(--accent-rgb), 0.25)',
                            opacity: 0,
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                            e.currentTarget.style.boxShadow = '0 18px 35px rgba(var(--accent-rgb), 0.35)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(var(--accent-rgb), 0.25)';
                        }}
                    >
                        VIEW PORTFOLIO
                    </a>
                </div>
            </div>
        </section>
    );
}
