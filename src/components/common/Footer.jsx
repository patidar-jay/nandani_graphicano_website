import React from 'react';

export default function Footer({ data }) {
    return (
        <footer style={{ padding: '4rem 5%', background: 'var(--bg)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text)', fontSize: '2.5rem', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                        Nandani<span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontStyle: 'italic' }}>.</span>
                    </span>
                </a>
                
                <div style={{ display: 'flex', gap: '2rem', fontSize: '1.5rem' }}>
                    {data?.contact?.links && data.contact.links.length > 0 ? (
                        data.contact.links.map((link, idx) => {
                            const platformIcons = {
                                whatsapp: 'fa-brands fa-whatsapp',
                                instagram: 'fa-brands fa-instagram',
                                email: 'fa-regular fa-envelope',
                                linkedin: 'fa-brands fa-linkedin-in',
                                behance: 'fa-brands fa-behance',
                                dribbble: 'fa-brands fa-dribbble',
                                youtube: 'fa-brands fa-youtube',
                                twitter: 'fa-brands fa-x-twitter',
                                facebook: 'fa-brands fa-facebook-f',
                                phone: 'fa-solid fa-phone',
                                website: 'fa-solid fa-globe',
                                custom: 'fa-solid fa-link'
                            };
                            const iconClass = platformIcons[link.platform] || 'fa-solid fa-link';
                            let href = link.value;
                            if (link.platform === 'whatsapp') href = `https://wa.me/${link.value.replace(/[^0-9]/g, '')}`;
                            else if (link.platform === 'email') href = `mailto:${link.value}`;
                            else if (link.platform === 'instagram' && !href.includes('instagram.com')) href = `https://instagram.com/${href.replace('@', '')}`;
                            else if (link.platform === 'twitter' && !href.includes('twitter.com') && !href.includes('x.com')) href = `https://twitter.com/${href.replace('@', '')}`;
                            else if (!href.startsWith('http') && !href.startsWith('mailto')) href = `https://${href}`;

                            return (
                                <a key={idx} href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className={iconClass}></i></a>
                            );
                        })
                    ) : (
                        <>
                            <a href="#" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-behance"></i></a>
                            <a href="#" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-dribbble"></i></a>
                            <a href={`https://instagram.com/${(data?.contact?.instagram || '').replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-instagram"></i></a>
                            <a href="#" style={{ color: 'var(--muted)', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted)'}><i className="fa-brands fa-linkedin-in"></i></a>
                        </>
                    )}
                </div>
                
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', letterSpacing: '1px', marginTop: '2rem' }}>
                    &copy; {new Date().getFullYear()} Nandani Graphicano. All Rights Reserved. Crafted with passion.
                </p>
            </div>
        </footer>
    );
}
