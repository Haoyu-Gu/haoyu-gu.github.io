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

    // 动画管理器 - 确保全覆盖
    const animationManager = {
        init() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // 观察所有可动画的元素 - 直接观察每个元素，不依赖容器
            const animatableElements = document.querySelectorAll([
                '.section:not(.hero)',           // 所有非Hero的section
                '.card',                         // 所有卡片
                '.timeline-item',                // 所有时间线项目
                '.skill-item',                   // 所有技能项目
                '.section-subtitle',             // 所有小标题
                '.contact-item'                  // 所有联系项目
            ].join(', '));
            
            animatableElements.forEach(el => observer.observe(el));
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

    // Friends scroll management
    const friendsScrollManager = {
        init() {
            this.container = document.getElementById('friendsGrid');
            this.leftBtn = document.getElementById('friendsNavLeft');
            this.rightBtn = document.getElementById('friendsNavRight');
            this.autoToggleBtn = document.getElementById('friendsAutoToggle');
            this.autoScrollIcon = document.getElementById('autoScrollIcon');
            this.autoScrollInterval = null;
            this.isAutoScrolling = false;
            this.autoScrollDirection = 1; // 1 for right, -1 for left
            this.autoScrollDelay = 3000; // 3 seconds

            if (!this.container) return;

            this.checkScrollability();
            this.setupEventListeners();
            this.startAutoScroll();

            // Check scrollability on window resize
            window.addEventListener('resize', utils.debounce(() => this.checkScrollability(), 250));
        },

        checkScrollability() {
            if (!this.container) return;

            // Always show scroll buttons for friends section
            this.leftBtn.style.display = 'flex';
            this.rightBtn.style.display = 'flex';
            this.autoToggleBtn.style.display = 'flex';
            this.updateNavigationState();
        },

        setupEventListeners() {
            if (this.leftBtn) {
                this.leftBtn.addEventListener('click', () => {
                    this.pauseAutoScroll();
                    this.scrollLeft();
                });
            }
            if (this.rightBtn) {
                this.rightBtn.addEventListener('click', () => {
                    this.pauseAutoScroll();
                    this.scrollRight();
                });
            }

            if (this.container) {
                this.container.addEventListener('scroll', utils.debounce(() => this.updateNavigationState(), 100));

                // Pause auto-scroll on hover
                this.container.addEventListener('mouseenter', () => this.pauseAutoScroll());
                this.container.addEventListener('mouseleave', () => this.resumeAutoScroll());

                // Pause auto-scroll on touch
                this.container.addEventListener('touchstart', () => this.pauseAutoScroll());
                this.container.addEventListener('touchend', () => this.resumeAutoScroll());
            }

            // Auto-scroll toggle button
            if (this.autoToggleBtn) {
                this.autoToggleBtn.addEventListener('click', () => this.toggleAutoScroll());
            }
        },

        scrollLeft() {
            const scrollAmount = this.container.clientWidth * 0.8;
            this.container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        },

        scrollRight() {
            const scrollAmount = this.container.clientWidth * 0.8;
            this.container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        },

        updateNavigationState() {
            if (!this.container) return;

            const { scrollLeft, scrollWidth, clientWidth } = this.container;

            // Update left button
            this.leftBtn.style.opacity = scrollLeft > 0 ? '0.7' : '0.3';
            this.leftBtn.style.cursor = scrollLeft > 0 ? 'pointer' : 'not-allowed';

            // Update right button
            const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
            this.rightBtn.style.opacity = isAtEnd ? '0.3' : '0.7';
            this.rightBtn.style.cursor = isAtEnd ? 'not-allowed' : 'pointer';
        },

        startAutoScroll() {
            if (this.autoScrollInterval) return;

            this.isAutoScrolling = true;
            this.updateAutoScrollIcon(true);
            this.autoScrollInterval = setInterval(() => {
                if (!this.container) return;

                const { scrollLeft, scrollWidth, clientWidth } = this.container;
                const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
                const isAtStart = scrollLeft <= 0;

                // Change direction when reaching boundaries
                if (isAtEnd && this.autoScrollDirection === 1) {
                    this.autoScrollDirection = -1;
                } else if (isAtStart && this.autoScrollDirection === -1) {
                    this.autoScrollDirection = 1;
                }

                // Perform auto scroll
                const scrollAmount = this.container.clientWidth * 0.4; // Smaller scroll amount for smoother auto-scroll
                this.container.scrollBy({
                    left: scrollAmount * this.autoScrollDirection,
                    behavior: 'smooth'
                });
            }, this.autoScrollDelay);
        },

        pauseAutoScroll() {
            if (this.autoScrollInterval) {
                clearInterval(this.autoScrollInterval);
                this.autoScrollInterval = null;
                this.isAutoScrolling = false;
            }
        },

        resumeAutoScroll() {
            // Resume after a delay to allow user interaction to complete
            setTimeout(() => {
                if (!this.isAutoScrolling) {
                    this.startAutoScroll();
                }
            }, 1000);
        },

        toggleAutoScroll() {
            if (this.isAutoScrolling) {
                this.pauseAutoScroll();
                this.updateAutoScrollIcon(false);
            } else {
                this.startAutoScroll();
                this.updateAutoScrollIcon(true);
            }
        },

        updateAutoScrollIcon(isScrolling) {
            if (this.autoScrollIcon) {
                this.autoScrollIcon.className = isScrolling ? 'fas fa-pause' : 'fas fa-play';
                this.autoToggleBtn.title = isScrolling ? 'Pause auto-scroll' : 'Resume auto-scroll';
            }
        }
    };

    // Initialize everything when DOM is loaded
    function init() {
        themeManager.init();
        languageManager.init();
        navigationManager.init();
        animationManager.init();
        friendsScrollManager.init();
        
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