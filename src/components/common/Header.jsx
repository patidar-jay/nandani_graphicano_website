import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function Header({ data }) {
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (window.scrollY > 50) {
                header.style.background = 'rgba(255, 255, 255, 0.9)';
                header.style.backdropFilter = 'blur(20px)';
                header.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
                header.style.padding = '1rem 5%';
                header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.05)';
            } else {
                header.style.background = 'transparent';
                header.style.backdropFilter = 'none';
                header.style.borderBottom = '1px solid transparent';
                header.style.padding = '2rem 5%';
                header.style.boxShadow = 'none';
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        // Initial animation
        gsap.from('header', { y: -100, opacity: 0, duration: 1.5, ease: 'power4.out' });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header style={{
            position: 'fixed',
            top: 0, left: 0, right: 0,
            padding: '2rem 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1000,
            transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: 'var(--text)', fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                    Nandani<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>.</span>
                </span>
            </Link>
            
            <nav style={{ display: 'none' }} className="desktop-nav">
                <ul style={{
                    listStyle: 'none',
                    display: 'flex',
                    gap: '3rem',
                    margin: 0, padding: 0
                }}>
                    {['About', 'Services', 'Portfolio', 'Process', 'Contact'].map((item) => (
                        <li key={item}>
                            <a href={`#${item.toLowerCase()}`} style={{
                                textDecoration: 'none',
                                color: 'var(--text)',
                                fontSize: '0.9rem',
                                textTransform: 'uppercase',
                                letterSpacing: '2px',
                                fontWeight: 500,
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}>
                                {item}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <style>{`
                @media (min-width: 768px) {
                    .desktop-nav { display: block !important; }
                }
            `}</style>
        </header>
    );
}
