import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
    const dotRef = useRef(null);
    const outlineRef = useRef(null);

    useEffect(() => {
        // Only run on desktop
        if (window.innerWidth <= 768) return;

        const dot = dotRef.current;
        const outline = outlineRef.current;

        const moveCursor = (e) => {
            gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
            gsap.to(outline, { x: e.clientX, y: e.clientY, duration: 0.5, ease: 'power2.out' });
        };

        const handleMouseOver = (e) => {
            if (e.target.tagName.toLowerCase() === 'a' || e.target.tagName.toLowerCase() === 'button' || e.target.closest('a') || e.target.closest('button')) {
                gsap.to(dot, { scale: 0, duration: 0.2 });
                gsap.to(outline, { scale: 1.5, backgroundColor: 'rgba(212, 175, 55, 0.1)', duration: 0.2 });
            } else {
                gsap.to(dot, { scale: 1, duration: 0.2 });
                gsap.to(outline, { scale: 1, backgroundColor: 'transparent', duration: 0.2 });
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    return (
        <>
            <div ref={dotRef} className="cursor-dot"></div>
            <div ref={outlineRef} className="cursor-outline"></div>
        </>
    );
}
