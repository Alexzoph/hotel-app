document.addEventListener('DOMContentLoaded', function() {
    // Galería de imágenes
    const mainImage = document.getElementById('main-room-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Cambiar imagen principal al hacer clic en una miniatura
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Actualizar imagen principal
            const imageSrc = this.getAttribute('data-src');
            mainImage.src = imageSrc;
            
            // Actualizar clase activa
            thumbnails.forEach(thumb => thumb.classList.remove('active'));
            this.classList.add('active');
            
            // Efecto de zoom suave
            mainImage.style.transform = 'scale(1.02)';
            setTimeout(() => {
                mainImage.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // Formulario de reserva rápida
    const bookingFormMini = document.querySelector('.booking-form-mini');
    const checkInInput = document.getElementById('check-in');
    const checkOutInput = document.getElementById('check-out');
    
    if (bookingFormMini && checkInInput && checkOutInput) {
        // Establecer fecha mínima como hoy
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
        checkInInput.value = formatDate(today);
        checkOutInput.min = formatDate(tomorrow);
        checkOutInput.value = formatDate(tomorrow);
        
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
        
        // Manejar envío del formulario
        bookingFormMini.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener valores del formulario
            const checkIn = checkInInput.value;
            const checkOut = checkOutInput.value;
            const guests = document.getElementById('guests').value;
            
            // Redirigir a la página de reserva con los parámetros
            window.location.href = `reserva.html?room=deluxe&checkin=${checkIn}&checkout=${checkOut}&guests=${guests}`;
        });
    }
});