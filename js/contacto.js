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
    
    // Manejo del formulario de contacto
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulación de envío del formulario
            // Aquí se enviaría el formulario a la base de datos una vez se realice
            
            // Mostrar mensaje de éxito después de un breve retraso
            setTimeout(() => {
                contactForm.style.display = 'none';
                formSuccess.style.display = 'block';
                
                // Restablecer el formulario
                contactForm.reset();
                
                // Volver a mostrar el formulario después de 5 segundos
                setTimeout(() => {
                    formSuccess.style.display = 'none';
                    contactForm.style.display = 'flex';
                }, 5000);
            }, 1000);
        });
    }
    
    // Animación para los elementos al hacer scroll
    const animateElements = document.querySelectorAll('.info-item, .direction-item');
    
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
        animateElements.forEach(item => {
            if (isInViewport(item) && !item.classList.contains('animated')) {
                item.classList.add('animated');
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Configurar los elementos para la animación
    animateElements.forEach(item => {
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