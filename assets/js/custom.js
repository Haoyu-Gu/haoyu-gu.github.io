// Custom JavaScript for single page portfolio

(function() {
    'use strict';

    // Theme management
    const themeManager = {
        init() {
            this.themeToggle = document.querySelector('.theme-toggle');
            this.currentTheme = localStorage.getItem('theme') || 'light';
            
            this.applyTheme(this.currentTheme);
            this.updateThemeIcon();
            
            if (this.themeToggle) {
                this.themeToggle.addEventListener('click', () => this.toggleTheme());
            }
        },
        
        toggleTheme() {
            this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(this.currentTheme);
            this.updateThemeIcon();
            localStorage.setItem('theme', this.currentTheme);
        },
        
        applyTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
        },
        
        updateThemeIcon() {
            if (this.themeToggle) {
                this.themeToggle.innerHTML = this.currentTheme === 'light' ? '🌙' : '☀️';
            }
        }
    };

    // Language management
    const languageManager = {
        init() {
            this.langToggle = document.querySelector('.lang-toggle');
            this.currentLang = localStorage.getItem('language') || 'en';
            
            this.updateLanguage();
            
            if (this.langToggle) {
                this.langToggle.addEventListener('click', () => this.toggleLanguage());
            }
        },
        
        toggleLanguage() {
            this.currentLang = this.currentLang === 'en' ? 'zh' : 'en';
            this.updateLanguage();
            localStorage.setItem('language', this.currentLang);
        },
        
        updateLanguage() {
            const elements = document.querySelectorAll('[data-lang]');
            elements.forEach(element => {
                const langData = element.getAttribute('data-lang');
                try {
                    const translations = JSON.parse(langData);
                    element.textContent = translations[this.currentLang] || translations.en;
                } catch (e) {
                    console.warn('Invalid language data:', langData);
                }
            });
            
            if (this.langToggle) {
                this.langToggle.textContent = this.currentLang === 'en' ? '中文' : 'EN';
            }
        }
    };

    // Smooth scrolling navigation
    const navigationManager = {
        init() {
            this.navItems = document.querySelectorAll('.nav-item a[href^="#"]');
            this.sections = document.querySelectorAll('.section');
            
            this.setupSmoothScrolling();
            this.setupActiveNavigation();
        },
        
        setupSmoothScrolling() {
            this.navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = item.getAttribute('href').substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const navHeight = document.querySelector('.custom-nav').offsetHeight;
                        const targetPosition = targetSection.offsetTop - navHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },
        
        setupActiveNavigation() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const activeNavItem = document.querySelector(`a[href="#${entry.target.id}"]`);
                        
                        // Remove active class from all nav items
                        this.navItems.forEach(item => item.classList.remove('active'));
                        
                        // Add active class to current nav item
                        if (activeNavItem) {
                            activeNavItem.classList.add('active');
                        }
                    }
                });
            }, {
                rootMargin: '-50% 0px -50% 0px'
            });
            
            this.sections.forEach(section => {
                observer.observe(section);
            });
        }
    };

    // Animation management for scroll-triggered animations
    const animationManager = {
        init() {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateElement(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe all animatable elements
            this.observeElements();
        },

        observeElements() {
            // Sections (excluding hero)
            const sections = document.querySelectorAll('.section:not(.hero)');
            sections.forEach(section => this.observer.observe(section));

            // Cards
            const cards = document.querySelectorAll('.card-grid .card');
            cards.forEach(card => this.observer.observe(card));

            // Timeline items
            const timelineItems = document.querySelectorAll('.timeline-item');
            timelineItems.forEach(item => this.observer.observe(item));

            // Research items
            const researchItems = document.querySelectorAll('.research-item');
            researchItems.forEach(item => this.observer.observe(item));

            // Skill items
            const skillItems = document.querySelectorAll('.skills-grid .skill-item');
            skillItems.forEach(item => this.observer.observe(item));
        },

        animateElement(element) {
            // Add animate-in class to trigger animations
            element.classList.add('animate-in');
            
            // For containers with multiple children, animate children too
            if (element.classList.contains('card-grid')) {
                const cards = element.querySelectorAll('.card');
                cards.forEach(card => card.classList.add('animate-in'));
            }
            
            if (element.classList.contains('skills-grid')) {
                const skillItems = element.querySelectorAll('.skill-item');
                skillItems.forEach(item => item.classList.add('animate-in'));
            }

            // Stop observing this element
            this.observer.unobserve(element);
        }
    };

    // Utility functions
    const utils = {
        // Add any utility functions here
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Format date for timeline
        formatDate(dateString) {
            const options = { year: 'numeric', month: 'short' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        }
    };

    // Initialize everything when DOM is loaded
    function init() {
        themeManager.init();
        languageManager.init();
        navigationManager.init();
        animationManager.init();
        
        // Add smooth scroll behavior to all internal links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const navHeight = document.querySelector('.custom-nav')?.offsetHeight || 0;
                    const targetPosition = target.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for global access if needed
    window.portfolioApp = {
        themeManager,
        languageManager,
        navigationManager,
        animationManager,
        utils
    };
})();