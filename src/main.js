// Initialize Lenis for smooth scrolling
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Mobile Menu Logic
document.addEventListener('DOMContentLoaded', () => {
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');
    
    if(burger && nav) {
        burger.addEventListener('click', () => {
            nav.style.display = nav.style.display === 'block' ? 'none' : 'block';
            // В реальной версии здесь можно добавить анимацию появления
            // или переключение класса .is-open для CSS трансформаций
            
            // Если меню открыто - меняем иконку (пример логики)
            const icon = burger.querySelector('svg');
            if(nav.style.display === 'block') {
                // Логика смены иконки через lucide API, если нужно,
                // либо простое переключение классов
            }
        });
    }

    // Close menu when clicking links
    const links = document.querySelectorAll('.header__link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992) {
                nav.style.display = 'none';
            }
        });
    });
});