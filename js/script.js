/* ==========================================================================
   芒果GEO - 交互脚本
   功能：导航栏滚动效果、汉堡菜单、咨询弹窗、滚动动画、返回顶部
   ========================================================================== */

(function () {
    'use strict';

    /* ==================== 1. 导航栏滚动效果 ==================== */
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });

    /* ==================== 2. 移动端汉堡菜单 ==================== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    function toggleMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        const expanded = hamburger.classList.contains('active');
        hamburger.setAttribute('aria-expanded', expanded);
        // 防止背景滚动
        document.body.style.overflow = expanded ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // 点击导航链接后自动关闭菜单
    navMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });

    /* ==================== 3. 咨询弹窗 ==================== */
    const modal = document.getElementById('contactModal');

    // 显示弹窗（全局函数，供 onclick 调用）
    window.showContact = function (event) {
        if (event) event.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // 关闭弹窗（全局函数）
    window.closeContact = function () {
        modal.classList.remove('active');
        // 如果汉堡菜单没展开，恢复滚动
        if (!navMenu.classList.contains('active')) {
            document.body.style.overflow = '';
        }
    };

    // 点击遮罩层关闭弹窗
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeContact();
        }
    });

    // ESC 键关闭弹窗
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            if (modal.classList.contains('active')) {
                closeContact();
            }
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        }
    });

    /* ==================== 4. 返回顶部按钮 ==================== */
    const backToTop = document.getElementById('backToTop');

    function handleBackToTop() {
        if (window.scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }

    window.addEventListener('scroll', handleBackToTop, { passive: true });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ==================== 5. 滚动渐入动画 ==================== */
    const revealElements = document.querySelectorAll('.reveal');

    // 使用 IntersectionObserver 实现高性能滚动监听
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px'
            }
        );

        revealElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // 降级方案：直接显示所有元素
        revealElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* ==================== 6. 导航高亮当前区块 ==================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(function (section) {
            const top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    /* ==================== 7. 初始化 ==================== */
    handleNavScroll();
    handleBackToTop();
})();
