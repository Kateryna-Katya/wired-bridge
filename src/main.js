document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LENIS (Smooth Scroll) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // --- 2. HEADER & MENU LOGIC ---
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.header__link');
    
    const toggleMenu = () => {
        const isActive = burger.classList.contains('is-active');
        
        if (isActive) {
            burger.classList.remove('is-active');
            nav.classList.remove('is-active');
            document.body.classList.remove('menu-open');
            lenis.start(); 
        } else {
            burger.classList.add('is-active');
            nav.classList.add('is-active');
            document.body.classList.add('menu-open');
            lenis.stop(); 
        }
    };

    if (burger) {
        burger.addEventListener('click', toggleMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) { 
                toggleMenu();
            }
        });
    });

    // --- 3. THREE.JS HERO ANIMATION ---
    function initThreeHero() {
        const container = document.getElementById('hero-canvas');
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Геометрия: Икосаэдр
        const geometry = new THREE.IcosahedronGeometry(2.5, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0xCCFF00, 
            wireframe: true,
            transparent: true,
            opacity: 0.8
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        const geometryInner = new THREE.IcosahedronGeometry(1.5, 0);
        const materialInner = new THREE.MeshBasicMaterial({ 
            color: 0xFFFFFF, 
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        const sphereInner = new THREE.Mesh(geometryInner, materialInner);
        scene.add(sphereInner);

        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;

        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        const animate = () => {
            requestAnimationFrame(animate);

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            sphere.rotation.y += 0.005;
            sphere.rotation.x += 0.002;
            
            sphere.rotation.y += 0.05 * (targetX - sphere.rotation.y);
            sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);

            sphereInner.rotation.y -= 0.005;
            sphereInner.rotation.x -= 0.002;

            renderer.render(scene, camera);
        };

        animate();

        window.addEventListener('resize', () => {
            const width = container.clientWidth;
            const height = container.clientHeight;
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }

    initThreeHero();

    // --- 4. SCROLL ANIMATIONS (GSAP) ---
    gsap.registerPlugin(ScrollTrigger);

    const fadeUpElements = document.querySelectorAll('[data-aos="fade-up"]');
    fadeUpElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, y: 50 },
            {
                opacity: 1, 
                y: 0, 
                duration: 1, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            }
        );
    });

    const fadeLeftElements = document.querySelectorAll('[data-aos="fade-left"]');
    fadeLeftElements.forEach(el => {
        gsap.fromTo(el, 
            { opacity: 0, x: 50 },
            {
                opacity: 1, 
                x: 0, 
                duration: 1, 
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                }
            }
        );
    });

    // --- 5. CONTACT FORM VALIDATION ---
    const form = document.getElementById('contactForm');
    const messageBox = document.getElementById('formMessage');
    const phoneInput = document.getElementById('phone');

    // ЖЕСТКАЯ ВАЛИДАЦИЯ ТЕЛЕФОНА (ТОЛЬКО ЦИФРЫ ПРИ ВВОДЕ)
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Заменяем всё, что не цифра (0-9), на пустую строку
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
    
    // Генерация капчи
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const captchaResult = num1 + num2;
    
    const captchaLabel = document.getElementById('captchaLabel');
    if (captchaLabel) {
        captchaLabel.textContent = `Сколько будет ${num1} + ${num2}?`;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            messageBox.textContent = '';
            messageBox.className = 'form__message';

            const userCaptcha = parseInt(document.getElementById('captcha').value);
            const name = document.getElementById('name').value;
            const phoneVal = phoneInput.value;

            // Проверка капчи
            if (userCaptcha !== captchaResult) {
                messageBox.textContent = 'Ошибка: Неверный ответ на пример.';
                messageBox.classList.add('error');
                return;
            }

            // Проверка имени
            if (name.length < 2) {
                messageBox.textContent = 'Ошибка: Имя слишком короткое.';
                messageBox.classList.add('error');
                return;
            }

            // Проверка телефона (минимум 8 цифр для Италии/Европы)
            if (phoneVal.length < 8) {
                messageBox.textContent = 'Ошибка: Введите корректный номер телефона (минимум 8 цифр).';
                messageBox.classList.add('error');
                return;
            }

            // Имитация отправки
            const btn = form.querySelector('button');
            const originalText = btn.textContent;
            btn.textContent = 'Отправка...';
            btn.disabled = true;

            setTimeout(() => {
                btn.textContent = 'Успешно!';
                messageBox.textContent = 'Grazie! Ваша заявка принята. Мы свяжемся с вами.';
                messageBox.classList.add('success');
                form.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // --- 6. COOKIE BANNER ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');

    if (!localStorage.getItem('cookiesAccepted')) {
        setTimeout(() => {
            cookieBanner.style.display = 'flex';
        }, 2000);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // --- 7. ICONS ---
    lucide.createIcons();
});