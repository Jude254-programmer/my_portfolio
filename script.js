// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize loading screen
    initializeLoadingScreen();
    
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 0
    });

    // Initialize all components
    initializeNavigation();
    initializeTheme();
    initializeScrollEffects();
    initializeTypingEffect();
    initializeProjectFilter();
    initializeSkillBars();
    initializeStatsCounter();
    initializeScrollToTop();
    initializeParallaxEffects();
    initializeSmoothScrolling();
    initializeLazyLoading();
    initializeAccessibility();
});

// ===== LOADING SCREEN =====
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        
        // Remove from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 1500);
}

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to system preference
    const savedTheme = getStoredTheme();
    const systemTheme = getSystemTheme();
    const currentTheme = savedTheme || systemTheme;
    
    body.setAttribute('data-theme', currentTheme);
    updateThemeToggle(currentTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        setStoredTheme(newTheme);
        updateThemeToggle(newTheme);
        
        // Add transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!getStoredTheme()) {
            const newTheme = e.matches ? 'dark' : 'light';
            body.setAttribute('data-theme', newTheme);
            updateThemeToggle(newTheme);
        }
    });
}

function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
        themeToggle.setAttribute('aria-label', 'Switch to light mode');
    } else {
        icon.className = 'fas fa-moon';
        themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    }
}

function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme() {
    try {
        return localStorage.getItem('theme');
    } catch (e) {
        return null;
    }
}

function setStoredTheme(theme) {
    try {
        localStorage.setItem('theme', theme);
    } catch (e) {
        // Silently fail if localStorage is not available
    }
}

// ===== SCROLL EFFECTS =====
function initializeScrollEffects() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Navbar scroll effect
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    // Active navigation link highlighting
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentSection = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    const texts = [
        'Mobile Software Engineer',
        'Data Science Enthusiast',
        'Flutter Developer',
        'Problem Solver'
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeWriter() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500; // Pause before next word
        }

        setTimeout(typeWriter, typingSpeed);
    }

    // Start typing effect after a delay
    setTimeout(typeWriter, 1000);
}

// ===== PROJECT FILTER =====
function initializeProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.6s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== SKILL BARS =====
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBar = entry.target;
                const level = skillBar.getAttribute('data-level');
                
                skillBar.style.transform = `scaleX(${level / 100})`;
                skillBar.style.transition = 'transform 1.5s ease-out';
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== STATS COUNTER =====
function initializeStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const target = parseInt(statNumber.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    statNumber.textContent = Math.floor(current);
                }, 16);
                
                statsObserver.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ===== SCROLL TO TOP =====
function initializeScrollToTop() {
    const scrollToTopBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    });
    
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== PARALLAX EFFECTS =====
function initializeParallaxEffects() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

// ===== SMOOTH SCROLLING =====
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== LAZY LOADING =====
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-src');
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== ACCESSIBILITY =====
function initializeAccessibility() {
    // Add keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');
            
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
    
    // Add focus management
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-related functions
}, 16);

window.addEventListener('scroll', throttledScrollHandler);

// Debounce resize events
const debouncedResizeHandler = debounce(() => {
    // Resize-related functions
}, 250);

window.addEventListener('resize', debouncedResizeHandler);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// ===== SERVICE WORKER REGISTRATION (for PWA features) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== ANALYTICS (if needed) =====
function trackEvent(eventName, eventData = {}) {
    // Google Analytics or other analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
    
    // Custom event tracking
    console.log('Event tracked:', eventName, eventData);
}

// Track important user interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('.project-link')) {
        trackEvent('project_link_click', {
            project: e.target.closest('.project-card')?.querySelector('h3')?.textContent
        });
    }
    
    if (e.target.matches('.social-link')) {
        trackEvent('social_link_click', {
            platform: e.target.closest('.social-link')?.querySelector('span')?.textContent
        });
    }
});

// ===== EXPORT FOR MODULE USE =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeLoadingScreen,
        initializeNavigation,
        initializeTheme,
        initializeScrollEffects,
        initializeTypingEffect,
        initializeProjectFilter,
        initializeSkillBars,
        initializeStatsCounter,
        initializeScrollToTop,
        initializeParallaxEffects,
        initializeSmoothScrolling,
        initializeLazyLoading,
        initializeAccessibility,
        debounce,
        throttle,
        trackEvent
    };
}