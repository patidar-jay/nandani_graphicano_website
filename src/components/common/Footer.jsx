import React from 'react';

export default function Footer({ data }) {
    return (
        <footer style={{ padding: '4rem 5%', background: '#FFFFFF', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text)', fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                        Nandani<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>.</span>
                    </span>
                </a>
                
                <div style={{ display: 'flex', gap: '2rem', fontSize: '1.5rem' }}>
                    <a href="#" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-behance"></i></a>
                    <a href="#" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-dribbble"></i></a>
                    <a href="https://instagram.com/nandani_graphicano" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-instagram"></i></a>
                    <a href="#" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-linkedin-in"></i></a>
                </div>
                
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', letterSpacing: '1px', marginTop: '2rem' }}>
                    &copy; {new Date().getFullYear()} Nandani Graphicano. All Rights Reserved. Crafted with passion.
                </p>
            </div>
        </footer>
    );
}
