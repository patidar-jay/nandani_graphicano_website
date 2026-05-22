// Custom Cursor
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Interactive elements hover effect for cursor
const interactables = document.querySelectorAll('a, button, .portfolio-item, .service-card');
interactables.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0.5)';
    });
    el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.backgroundColor = 'transparent';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
});

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const heroTl = gsap.timeline();
heroTl.to('.hero-title', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 })
      .to('.hero-subtitle', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
      .to('.hero-cta', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5');

// Scroll Animations for Sections
const sections = document.querySelectorAll('section:not(.hero)');
sections.forEach(section => {
    const title = section.querySelector('.section-title');
    if(title) {
        gsap.from(title, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        });
    }
    
    const subtitle = section.querySelector('.section-subtitle');
    if(subtitle) {
        gsap.from(subtitle, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
            },
            opacity: 0,
            y: 30,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2
        });
    }
});

// About Section
gsap.from('.about-image', {
    scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
    },
    opacity: 0,
    x: -50,
    duration: 1.2,
    ease: 'power2.out'
});

gsap.from('.about-text', {
    scrollTrigger: {
        trigger: '#about',
        start: 'top 70%',
    },
    opacity: 0,
    x: 50,
    duration: 1.2,
    ease: 'power2.out',
    delay: 0.3
});

// Services Grid
gsap.from('.service-card', {
    scrollTrigger: {
        trigger: '#services',
        start: 'top 70%',
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power2.out'
});

// Portfolio / Project Cards
gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '#portfolio',
        start: 'top 70%',
    },
    opacity: 0,
    y: 60,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power2.out'
});

// Features
gsap.from('.feature-item', {
    scrollTrigger: {
        trigger: '#why-me',
        start: 'top 70%',
    },
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.8,
    ease: 'back.out(1.7)'
});

// Timeline
gsap.from('.timeline-item', {
    scrollTrigger: {
        trigger: '#process',
        start: 'top 70%',
    },
    opacity: 0,
    x: (i, el) => el.classList.contains('left') ? -50 : 50,
    stagger: 0.2,
    duration: 1,
    ease: 'power2.out'
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

const statsSection = document.getElementById('stats');
let counted = false;

if(statsSection) {
    gsap.from('.stat-item', {
        scrollTrigger: {
            trigger: '#stats',
            start: 'top 80%',
            onEnter: () => {
                if (!counted) {
                    const counters = document.querySelectorAll('.stat-number');
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 30);
                        let current = 0;
                        
                        const updateCount = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                setTimeout(updateCount, 30);
                            } else {
                                counter.innerText = target + (target > 90 && target < 101 ? '%' : '+');
                            }
                        };
                        updateCount();
                    });
                    counted = true;
                }
            }
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.8
    });
}

// Creative Arsenal Animation
if(document.getElementById('tools')) {
    gsap.from('.tool-item', {
        scrollTrigger: {
            trigger: '#tools',
            start: 'top 80%'
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
    });
}

// Magnetic Buttons
const magnets = document.querySelectorAll('.btn');
magnets.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        // Calculate position relative to the center of the button
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;
        
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});
