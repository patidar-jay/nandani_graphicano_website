import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contact({ data }) {
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        setStatus('loading');
        
        try {
            const { error } = await supabase
                .from('contact_messages')
                .insert([{
                    name: formData.get('name'),
                    email: formData.get('email'),
                    message: formData.get('message'),
                    status: 'Unread'
                }]);
                
            if (error) throw error;
            
            setStatus('success');
            e.target.reset();
            
            setTimeout(() => setStatus('idle'), 4000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 4000);
        }
    };

    return (
        <section id="contact" style={{ padding: '8rem 5%', background: 'var(--card)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '6rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '4rem', color: 'var(--text)', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                        Let's Create<br/><span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>Something Amazing.</span>
                    </h2>
                    <p style={{ color: 'var(--muted)', marginBottom: '4rem', fontSize: '1.2rem', lineHeight: 1.8 }}>
                        Ready to elevate your brand's visual identity? Get in touch today to discuss your next big project.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '50px', height: '50px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                <i className="fa-brands fa-whatsapp"></i>
                            </div>
                            <span style={{ color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '1px' }}>{data.whatsapp || '+91 9343407099'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '50px', height: '50px', background: 'var(--accent-glow)', color: 'var(--accent)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
                                <i className="fa-solid fa-envelope"></i>
                            </div>
                            <span style={{ color: 'var(--text)', fontSize: '1.1rem', letterSpacing: '1px' }}>{data.email || 'hello@nandanigraphicano.com'}</span>
                        </div>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '4rem 3rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div>
                            <input name="name" type="text" placeholder="Your Name" required style={{
                                width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text)', outline: 'none'
                            }} />
                        </div>
                        <div>
                            <input name="email" type="email" placeholder="Your Email" required style={{
                                width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text)', outline: 'none'
                            }} />
                        </div>
                        <div>
                            <textarea name="message" rows="5" placeholder="Tell me about your project..." required style={{
                                width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.8)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '1rem', fontFamily: 'inherit', color: 'var(--text)', resize: 'vertical', outline: 'none'
                            }}></textarea>
                        </div>
                        <button type="submit" disabled={status === 'loading'} style={{
                            width: '100%', padding: '1.2rem', background: status === 'success' ? '#2e7d32' : 'var(--accent-gradient)', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'none', transition: 'all 0.3s', boxShadow: '0 5px 15px rgba(255, 106, 136, 0.2)'
                        }}>
                            {status === 'loading' ? 'Sending...' : status === 'success' ? 'Message Sent!' : status === 'error' ? 'Error. Try Again' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
