// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50
    });

    // Initialize all components
    initializeNavigation();
    initializeTheme();
    initializeScrollEffects();
    initializeTypingEffect();
});

// ===== NAVIGATION =====
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // Smooth scrolling for navigation links
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

// ===== THEME MANAGEMENT =====
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference or default to 'light'
    const currentTheme = getStoredTheme() || 'light';
    body.setAttribute('data-theme', currentTheme);
    updateThemeToggle(currentTheme);

    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        setStoredTheme(newTheme);
        updateThemeToggle(newTheme);
    });
}

function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    
    // Use icon symbols instead of emojis
    if (theme === 'dark') {
        themeToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
            </svg>
        `;
    } else {
        themeToggle.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        `;
    }
    
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

// Theme storage functions (fallback for environments without localStorage)
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
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }

        // Update dark theme navbar
        if (document.body.getAttribute('data-theme') === 'dark') {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// ===== TYPING EFFECT =====
function initializeTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;

    const text = heroTitle.innerHTML;
    const nameSpan = heroTitle.querySelector('.gradient-text');
    
    if (nameSpan) {
        const beforeName = "Hi, I'm ";
        const name = nameSpan.textContent;
        
        // Clear the title initially
        heroTitle.innerHTML = '';
        
        // Create typing effect
        let i = 0;
        const beforeNameLength = beforeName.length;
        
        function typeWriter() {
            if (i < beforeNameLength) {
                heroTitle.innerHTML += beforeName.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else if (i === beforeNameLength) {
                // Add the styled name span
                heroTitle.innerHTML += `<span class="gradient-text">${name}</span>`;
                i++;
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1000);
    }
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
function observeElements() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .contact-item');
    animateElements.forEach(el => observer.observe(el));
}

// Initialize intersection observer after DOM is loaded
document.addEventListener('DOMContentLoaded', observeElements);

// ===== SCROLL TO TOP FUNCTIONALITY =====
function createScrollToTop() {
    const scrollButton = document.createElement('button');
    scrollButton.innerHTML = '↑';
    scrollButton.className = 'scroll-to-top';
    scrollButton.setAttribute('aria-label', 'Scroll to top');
    
    const styles = `
        .scroll-to-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--gradient-primary);
            color: white;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--shadow-medium);
        }
        
        .scroll-to-top.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .scroll-to-top:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-heavy);
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#scroll-to-top-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-to-top-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.appendChild(scrollButton);
    
    // Show/hide scroll button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollButton.classList.add('visible');
        } else {
            scrollButton.classList.remove('visible');
        }
    });
    
    // Scroll to top functionality
    scrollButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', createScrollToTop);

// ===== PERFORMANCE OPTIMIZATIONS =====
// Debounce function for scroll events
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

// ===== FORM VALIDATION (if contact form is added later) =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ===== ACCESSIBILITY ENHANCEMENTS =====
function enhanceAccessibility() {
    // Add skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    
    const skipLinkStyles = `
        .skip-link {
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            transition: top 0.3s;
        }
        
        .skip-link:focus {
            top: 6px;
        }
    `;
    
    if (!document.querySelector('#accessibility-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'accessibility-styles';
        styleSheet.textContent = skipLinkStyles;
        document.head.appendChild(styleSheet);
    }
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main landmark to hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.id = 'main';
        heroSection.setAttribute('role', 'main');
    }
}

// Initialize accessibility enhancements
document.addEventListener('DOMContentLoaded', enhanceAccessibility);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
});

function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// ===== EXPORT FUNCTIONS FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        debounce,
        updateThemeToggle,
        getStoredTheme,
        setStoredTheme
    };
}