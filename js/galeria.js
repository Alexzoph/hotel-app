document.addEventListener('DOMContentLoaded', function() {
    // Elementos de la galería
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxOverlay = document.getElementById('lightbox-overlay');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    let currentImageIndex = 0;
    let currentImages = [];
    let itemsToShow = 12;
    let currentFilter = 'all';
    
    // Inicializar galería
    initializeGallery();
    
    function initializeGallery() {
        // Mostrar solo los primeros elementos
        showItems();
        
        // Configurar filtros
        setupFilters();
        
        // Configurar lightbox
        setupLightbox();
        
        // Configurar botón "Cargar más"
        setupLoadMore();
        
        // Configurar animación de estadísticas
        setupStatsAnimation();
    }
    
    function showItems() {
        const filteredItems = getFilteredItems();
        
        galleryItems.forEach((item, index) => {
            if (filteredItems.includes(item)) {
                const filteredIndex = filteredItems.indexOf(item);
                if (filteredIndex < itemsToShow) {
                    item.classList.remove('hidden');
                    item.classList.add('show');
                } else {
                    item.classList.add('hidden');
                    item.classList.remove('show');
                }
            } else {
                item.classList.add('hidden');
                item.classList.remove('show');
            }
        });
        
        // Mostrar/ocultar botón "Cargar más"
        const hasMoreItems = filteredItems.length > itemsToShow;
        loadMoreBtn.style.display = hasMoreItems ? 'inline-flex' : 'none';
    }
    
    function getFilteredItems() {
        if (currentFilter === 'all') {
            return Array.from(galleryItems);
        }
        return Array.from(galleryItems).filter(item => 
            item.getAttribute('data-category') === currentFilter
        );
    }
    
    function setupFilters() {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Actualizar filtro actual
                currentFilter = this.getAttribute('data-filter');
                itemsToShow = 12; // Resetear contador
                
                // Aplicar filtro con animación
                applyFilter();
            });
        });
    }
    
    function applyFilter() {
        // Ocultar todos los elementos primero
        galleryItems.forEach(item => {
            item.classList.add('hidden');
            item.classList.remove('show');
        });
        
        // Mostrar elementos filtrados después de un breve delay
        setTimeout(() => {
            showItems();
        }, 300);
    }
    
    function setupLightbox() {
        // Configurar botones de zoom
        const zoomButtons = document.querySelectorAll('.gallery-zoom');
        zoomButtons.forEach((button, index) => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                openLightbox(index);
            });
        });
        
        // Cerrar lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxOverlay.addEventListener('click', closeLightbox);
        
        // Navegación del lightbox
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);
        
        // Navegación con teclado
        document.addEventListener('keydown', function(e) {
            if (lightboxModal.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        closeLightbox();
                        break;
                    case 'ArrowLeft':
                        showPrevImage();
                        break;
                    case 'ArrowRight':
                        showNextImage();
                        break;
                }
            }
        });
    }
    
    function openLightbox(index) {
        // Obtener imágenes visibles actuales
        const visibleItems = Array.from(galleryItems).filter(item => 
            !item.classList.contains('hidden')
        );
        
        currentImages = visibleItems.map(item => {
            const zoomBtn = item.querySelector('.gallery-zoom');
            return {
                src: zoomBtn.getAttribute('data-src'),
                title: zoomBtn.getAttribute('data-title'),
                description: zoomBtn.getAttribute('data-description')
            };
        });
        
        // Encontrar el índice correcto en las imágenes visibles
        const clickedItem = document.querySelectorAll('.gallery-zoom')[index].closest('.gallery-item');
        currentImageIndex = visibleItems.indexOf(clickedItem);
        
        if (currentImageIndex === -1) currentImageIndex = 0;
        
        showLightboxImage();
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeLightbox() {
        lightboxModal.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    function showLightboxImage() {
        if (currentImages.length === 0) return;
        
        const image = currentImages[currentImageIndex];
        lightboxImage.src = image.src;
        lightboxImage.alt = image.title;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;
        lightboxCurrent.textContent = currentImageIndex + 1;
        lightboxTotal.textContent = currentImages.length;
        
        // Mostrar/ocultar botones de navegación
        lightboxPrev.style.display = currentImages.length > 1 ? 'block' : 'none';
        lightboxNext.style.display = currentImages.length > 1 ? 'block' : 'none';
    }
    
    function showPrevImage() {
        currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentImages.length - 1;
        showLightboxImage();
    }
    
    function showNextImage() {
        currentImageIndex = currentImageIndex < currentImages.length - 1 ? currentImageIndex + 1 : 0;
        showLightboxImage();
    }
    
    function setupLoadMore() {
        loadMoreBtn.addEventListener('click', function() {
            itemsToShow += 6;
            showItems();
            
            // Scroll suave a los nuevos elementos
            setTimeout(() => {
                const newItems = document.querySelectorAll('.gallery-item.show');
                if (newItems.length > 0) {
                    const lastItem = newItems[Math.min(itemsToShow - 6, newItems.length - 1)];
                    lastItem.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 100);
        });
    }
    
    function setupStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        let animated = false;
        
        function animateStats() {
            if (animated) return;
            
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 2 segundos
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(current);
                }, 16);
            });
            
            animated = true;
        }
        
        // Observador de intersección para animar cuando sea visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });
        
        const statsSection = document.querySelector('.gallery-stats');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }
    
    // Lazy loading para imágenes
    function setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Inicializar lazy loading
    setupLazyLoading();
    
    // Efecto parallax suave en scroll
    function setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.gallery-image');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
    
    // Configurar efecto parallax (opcional)
    // setupParallaxEffect();
});