import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Process({ data }) {
    const processRef = useRef(null);
    const itemsRef = useRef([]);

    const defaultSteps = [
        { title: "Discussion", desc: "Understanding your brand, goals, target audience, and project requirements." },
        { title: "Research", desc: "Analyzing industry trends, competitors, and gathering creative inspiration." },
        { title: "Design", desc: "Crafting the initial concepts and bringing the visual ideas to life." },
        { title: "Revision", desc: "Refining the chosen concept based on your valuable feedback." },
        { title: "Final Delivery", desc: "Handing over all high-resolution, print and web-ready source files." }
    ];

    const displaySteps = data && data.length > 0 ? data : defaultSteps;

    // Reset refs on data change
    useEffect(() => {
        itemsRef.current = itemsRef.current.slice(0, displaySteps.length);
    }, [displaySteps]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            itemsRef.current.forEach((el, index) => {
                gsap.from(el, {
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%"
                    }
                });
            });
        }, processRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={processRef} id="process" style={{ padding: '6rem 5%', background: 'transparent' }}>
            <h2 className="section-title">The <span>Workflow</span></h2>
            <p className="section-subtitle">A streamlined approach to achieving visual perfection.</p>
            
            <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
                {/* Vertical Line */}
                <div style={{
                    position: 'absolute',
                    left: '50px',
                    top: 0,
                    bottom: 0,
                    width: '1px',
                    background: 'var(--border)',
                    zIndex: 0
                }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {displaySteps.map((step, index) => (
                        <div key={index} ref={el => itemsRef.current[index] = el} style={{
                            display: 'flex',
                            gap: '2rem',
                            position: 'relative',
                            zIndex: 1
                        }}>
                            {/* Step Number Circle */}
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'var(--card)',
                                border: '1px solid var(--accent)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                fontFamily: 'var(--font-heading)',
                                fontSize: '2rem',
                                color: 'var(--accent)',
                                boxShadow: '0 0 20px rgba(212, 175, 55, 0.1)'
                            }}>
                                {String(index + 1).padStart(2, '0')}
                            </div>
                            
                            {/* Step Content */}
                            <div className="glass-panel" style={{
                                padding: '2.5rem',
                                flexGrow: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center'
                            }}>
                                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: 'var(--text)' }}>{step.title}</h3>
                                <p style={{ color: 'var(--muted)', lineHeight: 1.6 }}>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
