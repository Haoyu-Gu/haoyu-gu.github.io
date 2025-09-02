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
                        console.log('Animating element:', entry.target.className);
                        this.animateElement(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Wait for DOM to be fully ready, then observe elements
            setTimeout(() => {
                this.observeElements();
            }, 100);
        },

        observeElements() {
            // Primary strategy: observe sections, animate everything inside
            const sections = document.querySelectorAll('.section:not(.hero)');
            console.log('Found sections for animation:', sections.length);
            sections.forEach(section => this.observer.observe(section));

            // Fallback: observe standalone elements that might not be in sections
            const standaloneCardGrids = document.querySelectorAll('.card-grid:not(.section .card-grid)');
            const standaloneSkillsGrids = document.querySelectorAll('.skills-grid:not(.section .skills-grid)');
            const standaloneTimelineItems = document.querySelectorAll('.timeline-item:not(.section .timeline-item)');
            const standaloneResearchItems = document.querySelectorAll('.research-item:not(.section .research-item)');

            console.log('Standalone elements:', {
                cardGrids: standaloneCardGrids.length,
                skillsGrids: standaloneSkillsGrids.length,
                timelineItems: standaloneTimelineItems.length,
                researchItems: standaloneResearchItems.length
            });

            standaloneCardGrids.forEach(grid => this.observer.observe(grid));
            standaloneSkillsGrids.forEach(grid => this.observer.observe(grid));
            standaloneTimelineItems.forEach(item => this.observer.observe(item));
            standaloneResearchItems.forEach(item => this.observer.observe(item));
        },

        animateElement(element) {
            // Add animate-in class to trigger animations
            element.classList.add('animate-in');
            
            // For sections, animate content with appropriate delays
            if (element.classList.contains('section')) {
                // Animate cards inside card-grids
                const cardGrids = element.querySelectorAll('.card-grid');
                cardGrids.forEach(grid => {
                    const cards = grid.querySelectorAll('.card');
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.add('animate-in');
                        }, 200 + (index * 100)); // Start after section animation
                    });
                });

                // Animate skills grids
                const skillsGrids = element.querySelectorAll('.skills-grid');
                skillsGrids.forEach(grid => {
                    const skillItems = grid.querySelectorAll('.skill-item');
                    skillItems.forEach((item, index) => {
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, 200 + (index * 100));
                    });
                });

                // Animate timeline items
                const timelineItems = element.querySelectorAll('.timeline-item');
                timelineItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, 200 + (index * 150));
                });

                // Animate research items
                const researchItems = element.querySelectorAll('.research-item');
                researchItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, 200 + (index * 150));
                });
            }
            
            // For standalone card grids (if any)
            if (element.classList.contains('card-grid')) {
                const cards = element.querySelectorAll('.card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
            
            // For standalone skills grids (if any)
            if (element.classList.contains('skills-grid')) {
                const skillItems = element.querySelectorAll('.skill-item');
                skillItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate-in');
                    }, index * 100);
                });
            }

            // For standalone timeline and research items
            if (element.classList.contains('timeline-item') || element.classList.contains('research-item')) {
                // These will be animated individually, nothing special needed
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