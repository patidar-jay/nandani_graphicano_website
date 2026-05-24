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

function getVisitorId() {
    let id = localStorage.getItem('ng_visitor_id');
    if (!id) {
        id = 'v_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 8);
        localStorage.setItem('ng_visitor_id', id);
    }
    return id;
}

function isReturningVisitor() {
    const lastVisit = localStorage.getItem('ng_last_visit');
    const now = Date.now();
    localStorage.setItem('ng_last_visit', now.toString());
    if (!lastVisit) return false;
    return (now - parseInt(lastVisit)) > 30 * 60 * 1000;
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
            // Fallback API
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
    const sessionId = useRef('s_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 6));
    const sent = useRef(false);
    const locationData = useRef({ country: 'Unknown', region: 'Unknown', city: 'Unknown' });

    useEffect(() => {
        const visitorId = getVisitorId();
        const returning = isReturningVisitor();
        const device = getDeviceType();
        const browser = getBrowser();

        // Fetch location silently (no popup, IP-based)
        fetchLocation().then(loc => {
            locationData.current = loc;
        });

        // Track which sections are visible
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
            document.querySelectorAll('section[id], div[id]').forEach(el => {
                if (el.id) observer.observe(el);
            });
        }, 1000);

        // Tick every second to accumulate time per section
        const ticker = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastTick.current) / 1000;
            lastTick.current = now;
            activeSections.current.forEach(id => {
                sectionsTime.current[id] = (sectionsTime.current[id] || 0) + delta;
            });
        }, 1000);

        // Send analytics on page unload
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
                session_id: sessionId.current,
                device,
                browser,
                is_returning: returning,
                session_duration: duration,
                sections_viewed: sections,
                page_path: window.location.pathname,
                screen_width: window.innerWidth,
                country: loc.country,
                region: loc.region,
                city: loc.city
            };

            // Use sendBeacon for reliable delivery
            const url = `https://lcudchwoimjpatbxgsho.supabase.co/rest/v1/page_analytics`;
            const headers = {
                'apikey': 'sb_publishable_F1v0RXWHEr-MCYlJaue4SA_SVjYHHAd',
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            };

            try {
                const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                // sendBeacon doesn't support custom headers, use fetch with keepalive
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

        // Initial ping after 3 seconds
        const initialPing = setTimeout(async () => {
            try {
                await supabase.from('page_analytics').insert([{
                    visitor_id: visitorId,
                    session_id: sessionId.current,
                    device,
                    browser,
                    is_returning: returning,
                    session_duration: 0,
                    sections_viewed: {},
                    page_path: window.location.pathname,
                    screen_width: window.innerWidth,
                    country: locationData.current.country,
                    region: locationData.current.region,
                    city: locationData.current.city
                }]);
            } catch (e) {
                console.log('Analytics table not ready:', e.message);
            }
        }, 3000);

        window.addEventListener('beforeunload', sendAnalytics);
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') sendAnalytics();
        });

        return () => {
            clearInterval(ticker);
            clearTimeout(initialPing);
            observer.disconnect();
            window.removeEventListener('beforeunload', sendAnalytics);
        };
    }, []);
}
