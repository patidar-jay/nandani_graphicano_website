import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import CustomCursor from '../components/common/CustomCursor';
import Hero from '../components/landing/Hero';
import Tools from '../components/landing/Tools';
import Services from '../components/landing/Services';
import Stats from '../components/landing/Stats';
import Portfolio from '../components/landing/Portfolio';
import Features from '../components/landing/Features';
import Process from '../components/landing/Process';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';
import { useSiteData } from '../hooks/useSiteData';
import { useAnalytics } from '../hooks/useAnalytics';

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
    const { data, loading } = useSiteData();
    useAnalytics();
    const aboutRef = useRef(null);
    const aboutImgRef = useRef(null);
    const aboutTextRef = useRef(null);

    useEffect(() => {
        if (loading) return;
        const ctx = gsap.context(() => {
            // About image parallax + reveal
            gsap.from(aboutImgRef.current, {
                scrollTrigger: { trigger: aboutRef.current, start: 'top 80%' },
                x: -80, opacity: 0, duration: 1.2, ease: 'power3.out'
            });
            // About text stagger
            gsap.from(aboutTextRef.current?.children || [], {
                scrollTrigger: { trigger: aboutRef.current, start: 'top 75%' },
                y: 50, opacity: 0, duration: 0.9, stagger: 0.15, ease: 'power3.out', delay: 0.3
            });
        });
        return () => ctx.revert();
    }, [loading]);

    if (loading) {
        return (
            <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', flexDirection: 'column', gap: '2rem' }}>
                {/* Premium loading spinner */}
                <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <div style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        border: '2px solid transparent', borderTopColor: '#FF6A88', borderBottomColor: '#FF9A8B',
                        animation: 'spin 1s linear infinite', position: 'absolute'
                    }}></div>
                    <div style={{
                        width: '40px', height: '40px', borderRadius: '50%',
                        border: '2px solid transparent', borderLeftColor: '#FF99AC', borderRightColor: '#FF6A88',
                        animation: 'spin 1.5s linear infinite reverse', position: 'absolute', top: '10px', left: '10px'
                    }}></div>
                </div>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', color: 'var(--muted)', letterSpacing: '3px' }}>Nandani.</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    return (
        <>
            <CustomCursor />
            <Header data={data?.header} />
            <main>
                <Hero data={data?.hero} />

                {/* ═══ About Section ═══ */}
                <section ref={aboutRef} id="about" style={{
                    padding: '10rem 5%', background: 'var(--card)', position: 'relative', overflow: 'hidden'
                }}>
                    {/* Ambient glow */}
                    <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(255,106,136,0.06) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,154,139,0.05) 0%, transparent 70%)', pointerEvents: 'none' }}></div>

                    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '5rem', alignItems: 'center' }}>
                        {/* Image with decorative frame */}
                        <div ref={aboutImgRef} style={{ flex: '1 1 380px', position: 'relative' }}>
                            {/* Accent border frame */}
                            <div style={{
                                position: 'absolute', top: '-15px', left: '-15px', right: '15px', bottom: '15px',
                                border: '2px solid rgba(255,106,136,0.15)', borderRadius: '24px', zIndex: 0
                            }}></div>
                            {/* Glow */}
                            <div style={{ position: 'absolute', inset: '-20px', background: 'var(--accent-gradient)', filter: 'blur(50px)', opacity: 0.08, borderRadius: '50%', zIndex: 0 }}></div>
                            <img src={data?.about?.profileImage || '/assets/images/avatar.png'} alt="Nandani - Graphic Designer"
                                style={{ width: '100%', borderRadius: '20px', position: 'relative', zIndex: 1, border: '1px solid rgba(255,255,255,0.8)', boxShadow: '0 25px 50px rgba(0,0,0,0.06)' }} />
                            {/* Experience badge */}
                            <div style={{
                                position: 'absolute', bottom: '-20px', right: '-10px', zIndex: 2,
                                background: 'var(--accent-gradient)', color: '#fff',
                                padding: '1.2rem 1.8rem', borderRadius: '16px',
                                boxShadow: '0 15px 30px rgba(255,106,136,0.25)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '1.8rem', fontWeight: 800, lineHeight: 1 }}>3+</div>
                                <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.9 }}>Years Exp.</div>
                            </div>
                        </div>

                        {/* Text */}
                        <div ref={aboutTextRef} style={{ flex: '1 1 400px' }}>
                            <div style={{
                                display: 'inline-block', padding: '0.5rem 1.5rem',
                                background: 'rgba(255,106,136,0.06)', borderRadius: '50px',
                                fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600,
                                letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem',
                                border: '1px solid rgba(255,106,136,0.1)'
                            }}>About Me</div>
                            <h2 style={{
                                fontFamily: 'var(--font-heading)', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
                                marginBottom: '1.5rem', color: 'var(--text)', lineHeight: 1.2
                            }}>
                                {data?.about?.greeting || "Hello, I'm Nandani."}
                            </h2>
                            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.9, marginBottom: '1.2rem' }}>
                                {data?.about?.p1 || "I am a high-tier freelance visual identity expert."}
                            </p>
                            <p style={{ color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.9, marginBottom: '2.5rem' }}>
                                {data?.about?.p2 || "Let's build a brand that stands out."}
                            </p>
                            {/* Skill tags */}
                            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                                {['Logos', 'Branding', 'Social Media', 'Packaging', 'Print Design'].map(skill => (
                                    <span key={skill} style={{
                                        padding: '0.5rem 1.2rem', borderRadius: '50px', fontSize: '0.8rem',
                                        background: 'rgba(255,154,139,0.06)', color: 'var(--accent)', fontWeight: 600,
                                        border: '1px solid rgba(255,154,139,0.12)', letterSpacing: '0.5px'
                                    }}>{skill}</span>
                                ))}
                            </div>
                            <a href="#contact" style={{
                                display: 'inline-flex', alignItems: 'center', gap: '0.8rem',
                                padding: '1rem 2.5rem', background: 'var(--accent-gradient)', color: '#fff',
                                textDecoration: 'none', fontWeight: 600, letterSpacing: '1px', borderRadius: '50px',
                                boxShadow: '0 10px 25px rgba(255,106,136,0.2)', transition: 'all 0.3s', fontSize: '0.95rem'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(255,106,136,0.3)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(255,106,136,0.2)'; }}>
                                LET'S COLLABORATE <i className="fa-solid fa-arrow-right"></i>
                            </a>
                        </div>
                    </div>
                </section>

                {/* ═══ Visual Divider ═══ */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(255,106,136,0.15) 50%, transparent 100%)' }}></div>

                <Tools />
                <Services data={data?.services || []} />

                {/* ═══ Visual Divider ═══ */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(255,106,136,0.15) 50%, transparent 100%)' }}></div>

                <Stats />
                <Portfolio data={data?.projects || []} />

                {/* ═══ Visual Divider ═══ */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(255,106,136,0.15) 50%, transparent 100%)' }}></div>

                <Features />
                <Process />

                {/* ═══ Visual Divider ═══ */}
                <div style={{ height: '1px', background: 'linear-gradient(to right, transparent 0%, rgba(255,106,136,0.15) 50%, transparent 100%)' }}></div>

                <Testimonials data={data?.testimonials || []} />
                <Contact data={data?.contact || {}} />

                <a href={`https://wa.me/${data?.contact?.whatsapp?.replace(/[^0-9]/g, '') || '919343407099'}`} className="floating-whatsapp" target="_blank" rel="noopener noreferrer">
                    <i className="fa-brands fa-whatsapp"></i>
                </a>
            </main>
            <Footer data={data?.header} />
        </>
    );
}
