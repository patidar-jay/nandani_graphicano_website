import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

function getDeviceType() {
    const ua = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(ua)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return 'mobile';
    return 'desktop';
}

function getBrowser() {
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('SamsungBrowser')) return 'Samsung';
    if (ua.includes('Opera') || ua.includes('OPR')) return 'Opera';
    if (ua.includes('Edg')) return 'Edge';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    return 'Other';
}

function getSessionInfo() {
    let visitorId = localStorage.getItem('ng_visitor_id');
    const lastVisitStr = localStorage.getItem('ng_last_visit');
    let sessionId = localStorage.getItem('ng_session_id');
    
    const now = Date.now();
    let isReturning = false;
    
    if (!visitorId) {
        visitorId = 'v_' + now.toString(36) + '_' + Math.random().toString(36).substr(2, 8);
        localStorage.setItem('ng_visitor_id', visitorId);
        // Brand new visitor
    } else {
        // Has visited before
        isReturning = true;
    }
    
    // Check if new session (no session id, or last visit was > 30 mins ago)
    if (!sessionId || !lastVisitStr || (now - parseInt(lastVisitStr)) > 30 * 60 * 1000) {
        sessionId = 's_' + now.toString(36) + '_' + Math.random().toString(36).substr(2, 6);
        localStorage.setItem('ng_session_id', sessionId);
    }
    
    // Update last visit time
    localStorage.setItem('ng_last_visit', now.toString());
    
    return { visitorId, sessionId, isReturning };
}

// Fetch user location from IP (no permission needed, silent)
async function fetchLocation() {
    try {
        const res = await fetch('https://ipapi.co/json/');
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        return {
            country: data.country_name || 'Unknown',
            region: data.region || 'Unknown',
            city: data.city || 'Unknown'
        };
    } catch {
        try {
            const res = await fetch('https://ipinfo.io/json?token=');
            if (!res.ok) throw new Error('Failed');
            const data = await res.json();
            return {
                country: data.country || 'Unknown',
                region: data.region || 'Unknown',
                city: data.city || 'Unknown'
            };
        } catch {
            return { country: 'Unknown', region: 'Unknown', city: 'Unknown' };
        }
    }
}

export function useAnalytics() {
    const sessionStart = useRef(Date.now());
    const sectionsTime = useRef({});
    const activeSections = useRef(new Set());
    const lastTick = useRef(Date.now());
    const sent = useRef(false);
    const locationData = useRef({ country: 'Unknown', region: 'Unknown', city: 'Unknown' });
    const sessionInfo = useRef(null);

    useEffect(() => {
        sessionInfo.current = getSessionInfo();
        const { visitorId, sessionId, isReturning } = sessionInfo.current;
        const device = getDeviceType();
        const browser = getBrowser();

        fetchLocation().then(loc => {
            locationData.current = loc;
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const id = entry.target.id;
                if (!id) return;
                if (entry.isIntersecting) {
                    activeSections.current.add(id);
                } else {
                    activeSections.current.delete(id);
                }
            });
        }, { threshold: 0.3 });

        setTimeout(() => {
            document.querySelectorAll('section[id], div[id], main[id]').forEach(el => {
                if (el.id) observer.observe(el);
            });
        }, 1000);

        const ticker = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastTick.current) / 1000;
            lastTick.current = now;
            activeSections.current.forEach(id => {
                sectionsTime.current[id] = (sectionsTime.current[id] || 0) + delta;
            });
        }, 1000);

        const sendAnalytics = () => {
            if (sent.current) return;
            sent.current = true;

            const duration = Math.round((Date.now() - sessionStart.current) / 1000);
            const sections = {};
            Object.entries(sectionsTime.current).forEach(([k, v]) => {
                sections[k] = Math.round(v);
            });

            const loc = locationData.current;

            const payload = {
                visitor_id: visitorId,
                session_id: sessionId,
                device,
                browser,
                is_returning: isReturning,
                session_duration: duration,
                sections_viewed: sections,
                page_path: window.location.pathname,
                screen_width: window.innerWidth,
                country: loc.country,
                region: loc.region,
                city: loc.city
            };

            const url = `https://lcudchwoimjpatbxgsho.supabase.co/rest/v1/page_analytics`;
            const headers = {
                'apikey': 'sb_publishable_F1v0RXWHEr-MCYlJaue4SA_SVjYHHAd',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            };

            try {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                fetch(url, {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => {});
            } catch {
                supabase.from('page_analytics').insert([payload]).then(() => {});
            }
        };

        window.addEventListener('beforeunload', sendAnalytics);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') sendAnalytics();
        });

        return () => {
            clearInterval(ticker);
            observer.disconnect();
            window.removeEventListener('beforeunload', sendAnalytics);
        };
    }, []);
}
