import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loadingAction, setLoadingAction] = useState(false);
    
    const { user, loading, signIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user && !loading) {
            navigate('/admin.html');
        }
    }, [user, loading, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoadingAction(true);
        
        try {
            await signIn(email, password);
            navigate('/admin.html');
        } catch (err) {
            setError(err.message || 'An error occurred during login.');
        } finally {
            setLoadingAction(false);
        }
    };

    if (loading) return null;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh',
            background: 'var(--bg)', color: 'var(--text)'
        }}>
            <div className="glass-panel" style={{
                padding: '2.5rem', borderRadius: '20px', width: '100%', maxWidth: '400px',
                textAlign: 'center', background: 'var(--card)', border: '1px solid var(--border)',
                boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ marginBottom: '0.5rem', color: 'var(--text)', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Admin Login</h2>
                <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Sign in to manage your portfolio</p>
                
                {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '5px' }}>{error}</p>}
                
                <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{
                            width: '100%', padding: '0.8rem 1rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.95rem'
                        }} />
                    </div>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{
                            width: '100%', padding: '0.8rem 1rem', background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: '8px', fontFamily: 'inherit', fontSize: '0.95rem'
                        }} />
                    </div>
                    <button type="submit" disabled={loadingAction} style={{
                        width: '100%', padding: '1rem', background: 'var(--accent)', color: 'white', border: 'none', borderRadius: '8px', fontFamily: 'inherit', fontWeight: 600, cursor: loadingAction ? 'wait' : 'pointer', fontSize: '1rem', marginBottom: '1.5rem', transition: 'all 0.3s ease'
                    }}>
                        {loadingAction ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                    <a href="/" style={{ color: 'var(--text)', textDecoration: 'none' }}>&larr; Back to Site</a>
                </div>
            </div>
        </div>
    );
}
