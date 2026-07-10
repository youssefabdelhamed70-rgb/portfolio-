// ==========================================================
// Theme Toggle + Save Preference + Dynamic Icon
// ==========================================================
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const current = body.getAttribute('data-theme');
        const newTheme = current === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
        updateNavbarOnScroll();
    });
}

function updateThemeIcon(theme) {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// ==========================================================
// Language Toggle
// ==========================================================
const langToggle = document.getElementById('langToggle');
const savedLang = localStorage.getItem('lang') || 'en';

function applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    
    // Update all elements with data-en and data-ar attributes
    document.querySelectorAll('[data-en]').forEach(el => {
        const enText = el.getAttribute('data-en');
        const arText = el.getAttribute('data-ar');
        if (enText && arText) {
            el.textContent = lang === 'ar' ? arText : enText;
        }
    });
    
    // Update placeholders for form inputs
    document.querySelectorAll('[data-en-placeholder]').forEach(el => {
        const enPlaceholder = el.getAttribute('data-en-placeholder');
        const arPlaceholder = el.getAttribute('data-ar-placeholder');
        if (enPlaceholder && arPlaceholder) {
            el.placeholder = lang === 'ar' ? arPlaceholder : enPlaceholder;
        }
    });
    
    // Update lang toggle button text
    if (langToggle) {
        langToggle.textContent = lang === 'ar' ? 'EN' : 'عر';
    }
    
    // Update page title if it has translation attributes
    const pageTitle = document.querySelector('title');
    if (pageTitle && pageTitle.hasAttribute('data-en')) {
        pageTitle.textContent = lang === 'ar' ? pageTitle.getAttribute('data-ar') : pageTitle.getAttribute('data-en');
    }
    
    localStorage.setItem('lang', lang);
}

if (langToggle) {
    langToggle.addEventListener('click', () => {
        const current = localStorage.getItem('lang') || 'en';
        applyLanguage(current === 'en' ? 'ar' : 'en');
    });
}

// Apply saved language on page load
applyLanguage(savedLang);

// ==========================================================
// Navbar Dynamic Background based on Theme + Scroll
// ==========================================================
function updateNavbarOnScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    const isDark = body.getAttribute('data-theme') === 'dark';
    const scrollY = window.scrollY;

    navbar.style.background = scrollY > 50
        ? (isDark ? 'rgba(13, 43, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)')
        : (isDark ? 'rgba(10, 31, 30, 0.75)' : 'rgba(255, 255, 255, 0.75)');
}

window.addEventListener('scroll', updateNavbarOnScroll);
window.addEventListener('load', updateNavbarOnScroll);

// ==========================================================
// Mobile Menu (Open/Close + Icon)
// ==========================================================
const mobileBtn = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
        navMenu.classList.toggle('show');
        const icon = mobileBtn.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            const icon = mobileBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });
}

// ==========================================================
// Particle Animation in Hero Section
// ==========================================================
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    let isActive = true;
    
    function resizeCanvas() {
        const hero = canvas.closest('.hero');
        if (!hero) return;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const PARTICLE_COUNT = 60;
    const CONNECTION_DISTANCE = 120;
    const PARTICLE_COLOR = '#0d9488';
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = PARTICLE_COLOR;
            ctx.fill();
        }
    }
    
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < CONNECTION_DISTANCE) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(13, 148, 136, ${0.15 * (1 - dist / CONNECTION_DISTANCE)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        if (!isActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }
    
    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
    
    // Visibility check - pause when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isActive = entry.isIntersecting;
            if (isActive) {
                animate();
            } else {
                cancelAnimationFrame(animationId);
            }
        });
    }, { threshold: 0.1 });
    
    observer.observe(canvas);
    animate();
}

// ==========================================================
// Scroll Progress Bar
// ==========================================================
function initScrollProgressBar() {
    const progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    });
}

// ==========================================================
// Section Reveal Animations (IntersectionObserver)
// ==========================================================
function initSectionReveal() {
    const revealElements = document.querySelectorAll(
        'section, .project-card, .certification-card, .skill-category, .skill-category-card, .overview-card, .contact-item, .card-box, .timeline-item'
    );
    
    revealElements.forEach(el => {
        el.classList.add('reveal');
    });
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
}

// ==========================================================
// Animated Hero Stats Counter
// ==========================================================
function initHeroStatsCounter() {
    const heroStats = document.querySelectorAll('.hero-stat-number');
    
    heroStats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count')) || 0;
        const type = stat.getAttribute('data-type') || '';
        const isPlus = type === 'plus';
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        let started = false;
        
        function countUp() {
            if (started) return;
            started = true;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    stat.textContent = target + (isPlus ? '+' : '');
                } else {
                    stat.textContent = Math.ceil(current) + (isPlus ? '+' : '');
                }
            }, 16);
        }
        
        // Trigger on page load with a small delay
        setTimeout(countUp, 500);
    });
}

// ==========================================================
// Skill Bars Animation on Scroll
// ==========================================================
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const width = bar.getAttribute('data-width');
            bar.style.transition = 'width 1s ease';
            bar.style.width = width + '%';
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-progress').forEach(bar => {
    bar.style.width = '0%';
    skillObserver.observe(bar);
});

// ==========================================================
// Fade-in + Slide-up for any element
// ==========================================================
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.new-content, .timeline-item, .certification-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    fadeObserver.observe(el);
});

// ==========================================================
// Smooth Scrolling for internal links (anchor links)
// ==========================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const navbarHeight = 75;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});

// ==========================================================
// Active Nav Link on Scroll
// ==========================================================
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        const navbarHeight = 80;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ==========================================================
// Back-to-Top Button
// ==========================================================
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==========================================================
// Animate All Stats Counter (+ and %) for all elements
// ==========================================================
const statNumbers = document.querySelectorAll('.stat-number');

statNumbers.forEach(stat => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(stat);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });
    observer.observe(stat);
});

function animateStat(stat) {
    let target = stat.getAttribute('data-count') || stat.textContent;
    target = parseInt(target.replace('%','').replace('+','')) || 0;

    const type = stat.getAttribute('data-type') || '';
    const isPercent = type === 'percent';
    const isPlus = type === 'plus';

    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    stat.textContent = (isPlus ? '+' : '') + '0' + (isPercent ? '%' : '');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(timer);
            stat.textContent =
                (isPlus ? '+' : '') +
                target +
                (isPercent ? '%' : '');
        } else {
            stat.textContent =
                (isPlus ? '+' : '') +
                Math.ceil(current) +
                (isPercent ? '%' : '');
        }
    }, 16);
}

// ==========================================================
// Timeline Animation for About Page
// ==========================================================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                timelineObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

// ==========================================================
// Project Filters - Single-select filtering
// ==========================================================
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('#projectsGrid .project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) return;
    
    let activeFilter = 'all';
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Set the active filter
            activeFilter = filter;
            
            // Update UI
            updateFilterButtonsUI();
            filterProjects();
        });
    });
    
    function updateFilterButtonsUI() {
        filterButtons.forEach(btn => {
            const filter = btn.getAttribute('data-filter');
            if (filter === activeFilter) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    function filterProjects() {
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (activeFilter === 'all' || activeFilter === category) {
                card.style.display = 'flex';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    card.style.transition = 'all 0.4s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// ==========================================================
// Initialize Everything on Page Load
// ==========================================================
document.addEventListener('DOMContentLoaded', function() {
    initTimelineAnimation();
    initProjectFilters();
    initParticles();
    initScrollProgressBar();
    initSectionReveal();
    initHeroStatsCounter();
    initActiveNavOnScroll();
});
