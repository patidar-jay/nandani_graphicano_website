import React from 'react';

export default function Tools() {
    const tools = [
        { icon: "fa-solid fa-pen-nib", name: "Illustrator" },
        { icon: "fa-solid fa-image", name: "Photoshop" },
        { icon: "fa-brands fa-figma", name: "Figma" },
        { icon: "fa-solid fa-video", name: "Premiere Pro" },
        { icon: "fa-solid fa-wand-magic-sparkles", name: "Canva" }
    ];

    return (
        <section id="tools" style={{ padding: '3rem 5%', borderBottom: '1px solid var(--border)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '4rem', 
                    flexWrap: 'wrap', 
                    alignItems: 'center',
                    opacity: 0.8
                }}>
                    {tools.map((tool, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.8rem',
                            fontFamily: 'var(--font-heading)',
                            fontSize: '1.2rem',
                            color: 'var(--text)',
                            letterSpacing: '1px'
                        }}>
                            <i className={tool.icon} style={{ color: 'var(--accent)', fontSize: '1.4rem' }}></i>
                            {tool.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
