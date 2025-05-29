document.addEventListener('DOMContentLoaded', function() {
    // Actualizar año actual en el footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Menú para telefonos
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Configura las fechas mínimas para el formulario de búsqueda
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');

    if (checkInInput && checkOutInput) {
        // Establece la fecha mínima como hoy
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Formatear fechas para input date (YYYY-MM-DD)
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };

        checkInInput.min = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);

        // Actualizar fecha mínima de salida cuando cambia la fecha de entrada
        checkInInput.addEventListener('change', function() {
            const newMinCheckout = new Date(this.value);
            newMinCheckout.setDate(newMinCheckout.getDate() + 1);
            checkOutInput.min = formatDate(newMinCheckout);
            
            // Si la fecha de salida es anterior a la nueva fecha mínima, actualizarla
            if (new Date(checkOutInput.value) <= new Date(this.value)) {
                checkOutInput.value = formatDate(newMinCheckout);
            }
        });
    }

    // Formulario de búsqueda
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // En una aplicación real, redirigir a la página de resultados con los parámetros
            window.location.href = 'habitaciones.html';
        });
    }

    // Slider de opiniones
    const opinionesCards = document.querySelectorAll('.opiniones-card');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.opiniones-prev');
    const nextBtn = document.querySelector('.opiniones-next');

    if (opinionesCards.length > 0) {
        let currentIndex = 0;

        // Función para mostrar una opinion en específico
        const showOpiniones = (index) => {
            opinionesCards.forEach(card => {
                card.classList.remove('active');
            });
            dots.forEach(dot => {
                dot.classList.remove('active');
            });

            opinionesCards[index].classList.add('active');
            dots[index].classList.add('active');
        };

        // Evento para los botones de navegación
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex = (currentIndex - 1 + opinionesCards.length) % opinionesCards.length;
                showOpiniones(currentIndex);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex = (currentIndex + 1) % opinionesCards.length;
                showOpiniones(currentIndex);
            });
        }

        // Evento para los puntos indicadores
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIndex = index;
                showOpiniones(currentIndex);
            });
        });

        // Rotación automática de opiniones
        setInterval(() => {
            currentIndex = (currentIndex + 1) % opinionesCards.length;
            showOpiniones(currentIndex);
        }, 5000);
    }

    // Formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('¡Gracias por suscribirte a nuestro boletín!');
                emailInput.value = '';
            }
        });
    }

    // Formulario de newsletter del footer
    const footerNewsletterForm = document.querySelector('.footer-newsletter');
    if (footerNewsletterForm) {
        footerNewsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                alert('¡Gracias por suscribirte a nuestro boletín!');
                emailInput.value = '';
            }
        });
    }
});

async function checkAvailability() {
  try {
    const tipo_habitacion = document.getElementById('tipo_habitacion').value;
    if (!tipo_habitacion) throw new Error('Selecciona un tipo de habitación');
    const mockData = [
      { id: 1, tipo: 'Individual', estado: 'Disponible', precio: 100 },
      { id: 2, tipo: 'Doble', estado: 'Disponible', precio: 150 },
      { id: 3, tipo: 'Suite', estado: 'Ocupada', precio: 300 }
    ];
    const results = mockData.filter(room => 
      room.tipo.toLowerCase() === tipo_habitacion.toLowerCase() && 
      room.estado === 'Disponible'
    );
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = results.length > 0
      ? results.map(room => `<p>Habitación ${room.tipo} disponible por $${room.precio}</p>`).join('')
      : '<p>No hay habitaciones disponibles.</p>';
  } catch (error) {
    console.error(error);
    document.getElementById('results').innerHTML = `<p>Error: ${error.message}</p>`;
  }
}