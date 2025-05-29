document.addEventListener('DOMContentLoaded', function() {
    // Manejo de las preguntas frecuentes
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Cerrar todas las demás preguntas
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const toggle = otherItem.querySelector('.faq-toggle i');
                    toggle.className = 'fas fa-plus';
                }
            });
            
            // Alternar el estado actual
            item.classList.toggle('active');
            
            // Cambiar el icono
            const toggle = item.querySelector('.faq-toggle i');
            if (item.classList.contains('active')) {
                toggle.className = 'fas fa-times';
            } else {
                toggle.className = 'fas fa-plus';
            }
        });
    });
    
    // Animación para los elementos de servicio al hacer scroll
    const serviceItems = document.querySelectorAll('.service-item, .highlight-item, .service-card');
    
    // Función para verificar si un elemento está en el viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85 &&
            rect.bottom >= 0
        );
    }
    
    // Función para animar elementos cuando aparecen en el viewport
    function animateOnScroll() {
        serviceItems.forEach(item => {
            if (isInViewport(item) && !item.classList.contains('animated')) {
                item.classList.add('animated');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configurar los elementos para la animación
    serviceItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Ejecutar la animación al cargar la página y al hacer scroll
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('resize', animateOnScroll);
    
    // Ejecutar una vez al cargar para elementos ya visibles
    setTimeout(animateOnScroll, 100);
});