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
            
            // 切换CV链接
            const cvLink = document.querySelector('.cv-link');
            if (cvLink) {
                const enHref = cvLink.getAttribute('data-en-href');
                const zhHref = cvLink.getAttribute('data-zh-href');
                if (enHref && zhHref) {
                    cvLink.href = this.currentLang === 'en' ? enHref : zhHref;
                }
            }
            
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
                        const sectionId = entry.target.id;

                        // 研究相关的section（研究方向、研究经历、研究成果）统一激活"研究"菜单项
                        const researchSections = ['research', 'research-experience', 'outputs'];
                        const targetId = researchSections.includes(sectionId) ? 'research' : sectionId;

                        const activeNavItem = document.querySelector(`a[href="#${targetId}"]`);

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
                '.contact-item',                 // 所有联系项目
                '.publication-card',             // 所有论文卡片
                '.music-card'                    // 所有音乐卡片
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

    // Friends section - simple static grid (no scroll functionality needed)
    const friendsManager = {
        init() {
            // Friends section is now a simple responsive grid
            // No scroll functionality needed
        }
    };

    // Audio manager - ensures only one audio plays at a time
    const audioManager = {
        init() {
            this.audioElements = document.querySelectorAll('audio');
            this.currentlyPlaying = null;

            this.audioElements.forEach(audio => {
                audio.addEventListener('play', () => this.handlePlay(audio));
            });
        },

        handlePlay(audio) {
            // Pause the previously playing audio if different from current
            if (this.currentlyPlaying && this.currentlyPlaying !== audio) {
                this.currentlyPlaying.pause();
            }
            this.currentlyPlaying = audio;
        }
    };

    // Initialize everything when DOM is loaded
    function init() {
        themeManager.init();
        languageManager.init();
        navigationManager.init();
        animationManager.init();
        friendsManager.init();
        audioManager.init();
        
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
        audioManager,
        utils
    };
})();