document.addEventListener('DOMContentLoaded', function() {
    // Variables
    const bookingForm = document.getElementById('booking-form');
    const steps = document.querySelectorAll('.booking-step');
    const stepIndicators = document.querySelectorAll('.step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const roomTypeInputs = document.querySelectorAll('input[name="room-type"]');
    const additionalServices = document.querySelectorAll('.additional-services input');
    const paymentMethods = document.querySelectorAll('input[name="payment-method"]');
    const creditCardDetails = document.getElementById('credit-card-details');
    
    // Configura las fechas minimas para el formulario
    const checkInDate = document.getElementById('check-in-date');
    const checkOutDate = document.getElementById('check-out-date');
    
    if (checkInDate && checkOutDate) {
        // Establecer fecha minima como hoy
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Formatea fechas para input date (YYYY-MM-DD)
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        };
        
        checkInDate.min = formatDate(today);
        checkInDate.value = formatDate(today);
        checkOutDate.min = formatDate(tomorrow);
        checkOutDate.value = formatDate(tomorrow);
        
        // Actualiza la fecha minima de salida cuando cambia la fecha de entrada
        checkInDate.addEventListener('change', function() {
            const newMinCheckout = new Date(this.value);
            newMinCheckout.setDate(newMinCheckout.getDate() + 1);
            checkOutDate.min = formatDate(newMinCheckout);
            
            // Si la fecha de salida es anterior a la nueva fecha mínima se actualizara
            if (new Date(checkOutDate.value) <= new Date(this.value)) {
                checkOutDate.value = formatDate(newMinCheckout);
            }
            
            updateSummary();
        });
        
        checkOutDate.addEventListener('change', updateSummary);
    }
    
    // Navegación entre pasos
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentStep = parseInt(this.getAttribute('data-next')) - 1;
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validar el paso actual antes de avanzar
            if (validateStep(currentStep)) {
                goToStep(nextStep);
                
                // Si es el último paso, actualizar el resumen
                if (nextStep === 3) {
                    updateSummary();
                }
            }
        });
    });
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });
    
    // Función para ir a un paso específico
    function goToStep(stepNumber) {
        steps.forEach(step => step.classList.remove('active'));
        stepIndicators.forEach(indicator => indicator.classList.remove('active'));
        
        steps[stepNumber - 1].classList.add('active');
        stepIndicators[stepNumber - 1].classList.add('active');
        
        // Scroll al inicio del formulario
        bookingForm.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Validación de pasos
    function validateStep(stepNumber) {
        const currentStep = steps[stepNumber];
        
        if (stepNumber === 0) {
            // Validar selección de habitación
            const roomSelected = document.querySelector('input[name="room-type"]:checked');
            if (!roomSelected) {
                alert('Por favor, selecciona una habitación para continuar.');
                return false;
            }
            
            // Validar fechas
            if (!checkInDate.value || !checkOutDate.value) {
                alert('Por favor, selecciona las fechas de llegada y salida.');
                return false;
            }
            
            return true;
        }
        
        if (stepNumber === 1) {
            // Validar campos obligatorios del paso 2
            const requiredFields = currentStep.querySelectorAll('input[required], select[required]');
            let valid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    field.classList.add('invalid');
                    valid = false;
                } else {
                    field.classList.remove('invalid');
                }
            });
            
            /*if (!valid) {
                alert('Por favor, completa todos los campos obligatorios.');
                return false;
            }
            
            return true;*/
        }
        
        return true;
    }
    
    // Actualizar resumen de reserva
    function updateSummary() {
        // Obtener datos seleccionados
        const selectedRoom = document.querySelector('input[name="room-type"]:checked');
        const adults = document.getElementById('adults').value;
        const children = document.getElementById('children').value;
        
        if (!selectedRoom || !checkInDate.value || !checkOutDate.value) {
            return;
        }
        
        // Calcular noches
        const checkin = new Date(checkInDate.value);
        const checkout = new Date(checkOutDate.value);
        const nights = Math.round((checkout - checkin) / (1000 * 60 * 60 * 24));
        
        // Formatear fechas para mostrar
        const formatDisplayDate = (dateString) => {
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        };
        
        // Obtener precio y nombre de la habitación
        const roomPrice = parseFloat(selectedRoom.getAttribute('data-price'));
        const roomName = selectedRoom.getAttribute('data-name');
        
        // Calcular subtotal de alojamiento
        const subtotal = roomPrice * nights;
        
        // Actualizar elementos del resumen
        document.getElementById('summary-room').textContent = roomName;
        document.getElementById('summary-checkin').textContent = formatDisplayDate(checkInDate.value);
        document.getElementById('summary-checkout').textContent = formatDisplayDate(checkOutDate.value);
        document.getElementById('summary-nights').textContent = nights + (nights === 1 ? ' noche' : ' noches');
        document.getElementById('summary-guests').textContent = adults + (adults === '1' ? ' adulto' : ' adultos') + 
                                                             (children > 0 ? ' y ' + children + (children === '1' ? ' niño' : ' niños') : '');
        document.getElementById('summary-price-night').textContent = roomPrice.toFixed(2) + '€';
        document.getElementById('summary-subtotal').textContent = subtotal.toFixed(2) + '€';
        
        // Calcular servicios adicionales
        let additionalTotal = 0;
        const servicesList = document.getElementById('summary-services-list');
        servicesList.innerHTML = '';
        
        additionalServices.forEach(service => {
            if (service.checked) {
                const servicePrice = parseFloat(service.getAttribute('data-price'));
                const serviceLabel = service.nextElementSibling.textContent.split('(')[0].trim();
                
                // Multiplicar por noches o personas según el servicio
                let finalPrice = servicePrice;
                if (service.id === 'service-parking' || service.id === 'service-breakfast') {
                    finalPrice *= nights;
                    
                    // Para desayuno, multiplicar también por número de personas
                    if (service.id === 'service-breakfast') {
                        finalPrice *= parseInt(adults) + parseInt(children);
                    }
                }
                
                additionalTotal += finalPrice;
                
                // Añadir al resumen
                const serviceItem = document.createElement('div');
                serviceItem.className = 'summary-item';
                serviceItem.innerHTML = `
                    <div class="summary-label">- ${serviceLabel}:</div>
                    <div class="summary-value">${finalPrice.toFixed(2)}€</div>
                `;
                servicesList.appendChild(serviceItem);
            }
        });
        
        // Mostrar u ocultar sección de servicios adicionales
        const servicesContainer = document.getElementById('summary-services-container');
        if (additionalTotal > 0) {
            servicesContainer.style.display = 'block';
        } else {
            servicesContainer.style.display = 'none';
        }
        
        // Calcular total
        const total = subtotal + additionalTotal;
        document.getElementById('summary-total').textContent = total.toFixed(2) + '€';
    }
    
    // Eventos para actualizar el resumen
    roomTypeInputs.forEach(input => {
        input.addEventListener('change', updateSummary);
    });
    
    additionalServices.forEach(service => {
        service.addEventListener('change', updateSummary);
    });
    
    document.getElementById('adults').addEventListener('change', updateSummary);
    document.getElementById('children').addEventListener('change', updateSummary);
    
    // Mostrar/ocultar detalles de tarjeta según método de pago
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'credit') {
                creditCardDetails.style.display = 'block';
            } else {
                creditCardDetails.style.display = 'none';
            }
        });
    });
    
    // Envío del formulario
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar términos y condiciones
        const termsAccepted = document.getElementById('terms').checked;
        if (!termsAccepted) {
            alert('Debes aceptar los términos y condiciones para continuar.');
            return;
        }
        
        // Validar detalles de tarjeta si es el método seleccionado
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        if (paymentMethod === 'credit') {
            const cardNumber = document.getElementById('card-number').value;
            const cardName = document.getElementById('card-name').value;
            const cardExpiry = document.getElementById('card-expiry').value;
            const cardCvv = document.getElementById('card-cvv').value;
            
            if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                alert('Por favor, completa todos los detalles de la tarjeta.');
                return;
            }
        }
        
        // Simulación de envío exitoso
        alert('¡Reserva realizada con éxito! Recibirás un correo electrónico con la confirmación de tu reserva.');
        
        // Redireccionar a la página de confirmación (que por ahora es la página de inicio)
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    });
});