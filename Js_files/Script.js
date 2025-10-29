document.addEventListener('DOMContentLoaded', function() {
            // Loading screen elements
            const loadingScreen = document.getElementById('loadingScreen');
            const progressBar = document.getElementById('progressBar');
            const loadedPercent = document.getElementById('loadedPercent');
            const mainContent = document.getElementById('mainContent');
            
            // Initialize main content as hidden
            mainContent.style.display = 'none';
            
            // Simulate loading progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    // Smooth transition to main content
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        setTimeout(() => {
                            mainContent.style.display = 'block';
                            // Trigger any entrance animations
                            document.body.classList.add('loaded');
                            
                            // Start the typing animation
                            startTypingAnimation();
                            
                        }, 300);
                    }, 500);
                }
                
                // Update progress bar and percentage
                progressBar.style.width = `${progress}%`;
                loadedPercent.textContent = `${Math.round(progress)}%`;
            }, 200);
            
            // Typing animation function
            function startTypingAnimation() {
                const typeText = document.getElementById('type-text');
                const cursor = document.querySelector('.cursor');
                
                // Check if elements exist
                if (!typeText) {
                    console.error('Type text element not found');
                    return;
                }
                
                const texts = [
                    "Discover amazing movies...",
                    "Find your next favorite TV show...", 
                    "Explore trending content...",
                    "Personalized recommendations...",
                    "Your cinematic journey begins here..."
                ];
                
                let textIndex = 0;
                let charIndex = 0;
                let isDeleting = false;
                let isPaused = false;
                
                function type() {
                    if (isPaused) return;
                    
                    const currentText = texts[textIndex];
                    
                    if (isDeleting) {
                        typeText.textContent = currentText.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        typeText.textContent = currentText.substring(0, charIndex + 1);
                        charIndex++;
                    }
                    
                    // Type speed variations
                    let typeSpeed = isDeleting ? 50 : 100;
                    
                    // Random speed variation for natural feel
                    typeSpeed += Math.random() * 30;
                    
                    if (!isDeleting && charIndex === currentText.length) {
                        // Pause at the end of typing
                        isDeleting = true;
                        setTimeout(type, 2000);
                    } else if (isDeleting && charIndex === 0) {
                        // Move to next text
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                        setTimeout(type, 500);
                    } else {
                        setTimeout(type, typeSpeed);
                    }
                }
                
                // Start typing animation after a delay
                setTimeout(type, 1000);
                
                // Pause animation when user interacts
                document.addEventListener('focus', () => isPaused = true);
                document.addEventListener('blur', () => isPaused = false);
            }

            // Interactive features hover effect
            const interactiveFeatures = document.querySelectorAll('.interactive-feature');
            interactiveFeatures.forEach(feature => {
                feature.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                    this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                });
                
                feature.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
                });
                
                // Add click effect
                feature.addEventListener('mousedown', function() {
                    this.style.transform = 'translateY(-2px) scale(0.98)';
                });
                
                feature.addEventListener('mouseup', function() {
                    this.style.transform = 'translateY(-8px) scale(1)';
                });
            });
            
            // Search functionality
            const searchInput = document.querySelector('.search-input');
            const searchContainer = searchInput?.parentElement;
            
            if (searchInput && searchContainer) {
                searchInput.addEventListener('focus', function() {
                    searchContainer.classList.add('focused');
                    searchContainer.style.transform = 'scale(1.02)';
                });
                
                searchInput.addEventListener('blur', function() {
                    searchContainer.classList.remove('focused');
                    searchContainer.style.transform = 'scale(1)';
                });
                
                // Enhanced search with debouncing
                let searchTimeout;
                searchInput.addEventListener('input', function() {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        const query = this.value.trim();
                        if (query.length > 2) {
                            console.log('Searching for:', query);
                            // Implement actual search logic here
                            simulateSearch(query);
                        }
                    }, 500);
                });
            }
            
            function simulateSearch(query) {
                // This would be replaced with actual search logic
                console.log(`Simulating search for: ${query}`);
            }
            
            // Carousel navigation
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            const trailerBtn = document.querySelector('.trailer');
            const carouselImage = document.getElementById('carouselImage');
            const showName = document.getElementById('showName');
            const overview = document.getElementById('overview');
            
            // Carousel data
            const carouselData = [
                {
                    name: 'INTERSTELLAR',
                    image: 'https://i.imgur.com/8xY8Z2Q.jpg',
                    overview: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
                    details: {
                        type: 'Movie',
                        duration: '169m',
                        year: '2014'
                    }
                },
                {
                    name: 'INCEPTION',
                    image: 'https://i.imgur.com/7xY8Z2Q.jpg',
                    overview: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
                    details: {
                        type: 'Movie',
                        duration: '148m',
                        year: '2010'
                    }
                },
                {
                    name: 'THE DARK KNIGHT',
                    image: 'https://i.imgur.com/6xY8Z2Q.jpg',
                    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
                    details: {
                        type: 'Movie',
                        duration: '152m',
                        year: '2008'
                    }
                }
            ];
            
            // Carousel state
            let currentSlide = 0;
            
            // Initialize carousel with first slide
            updateCarousel();
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', function() {
                    currentSlide = (currentSlide - 1 + carouselData.length) % carouselData.length;
                    updateCarousel('previous');
                });
                
                nextBtn.addEventListener('click', function() {
                    currentSlide = (currentSlide + 1) % carouselData.length;
                    updateCarousel('next');
                });
            }
            
            function updateCarousel(direction) {
                if (!carouselImage || !showName || !overview) return;
                
                // Add transition class
                carouselImage.classList.add('changing');
                
                // Update content after a brief delay for smooth transition
                setTimeout(() => {
                    const currentData = carouselData[currentSlide];
                    
                    // Update background image with crossfade effect
                    carouselImage.style.backgroundImage = `linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('${currentData.image}')`;
                    
                    // Update text content
                    showName.textContent = currentData.name;
                    overview.textContent = currentData.overview;
                    
                    // Update details
                    const details = document.querySelector('.details');
                    if (details) {
                        details.innerHTML = `
                            <p><i class="fas fa-play-circle"></i> ${currentData.details.type}</p>
                            <p><i class="far fa-clock"></i> ${currentData.details.duration}</p>
                            <p><i class="far fa-calendar-alt"></i> ${currentData.details.year}</p>
                        `;
                    }
                    
                    // Remove transition class
                    setTimeout(() => {
                        carouselImage.classList.remove('changing');
                    }, 300);
                }, 150);
                
                console.log(`${direction || 'initial'} slide: ${carouselData[currentSlide].name}`);
            }
            
            if (trailerBtn) {
                trailerBtn.addEventListener('click', function() {
                    // Add loading state to button
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                    this.disabled = true;
                    
                    // Simulate trailer loading
                    setTimeout(() => {
                        alert(`Playing ${carouselData[currentSlide].name} trailer in a new window`);
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 1000);
                });
            }
            
            // Remind me functionality
            const remindButtons = document.querySelectorAll('.remind-btn');
            remindButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const card = this.closest('.upcoming-card');
                    const movieTitle = card.querySelector('.upcoming-title').textContent;
                    const releaseDate = card.querySelector('.upcoming-date').textContent;
                    
                    // Visual feedback
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Reminder Set!';
                    this.style.background = '#10b981';
                    
                    // Show notification
                    showNotification(`We'll remind you when "${movieTitle}" releases on ${releaseDate}!`);
                    
                    // Reset button after delay
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.style.background = '';
                    }, 3000);
                });
            });
            
            // Info buttons functionality
            const infoButtons = document.querySelectorAll('.info-btn-upcoming');
            infoButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    if (this.tagName === 'BUTTON') {
                        e.preventDefault();
                        const card = this.closest('.upcoming-card');
                        const movieTitle = card.querySelector('.upcoming-title').textContent;
                        showNotification(`More information about "${movieTitle}" would appear here.`);
                    }
                });
            });
            
            // Hero section buttons
            const heroPlayBtn = document.querySelector('.play-btn');
            const heroInfoBtn = document.querySelector('.info-btn');
            
            if (heroPlayBtn) {
                heroPlayBtn.addEventListener('click', function() {
                    window.location.href = 'Html_files/movies.html';
                });
            }
            
            if (heroInfoBtn) {
                heroInfoBtn.addEventListener('click', function() {
                    showNotification('MovieMate helps you discover amazing movies and TV shows with personalized recommendations.');
                });
            }

            // Feature section buttons
            const featureButtons = document.querySelectorAll('.features-section .btn-primary');
            featureButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const featureTitle = this.closest('.feature-card').querySelector('.feature-title').textContent;
                    showNotification(`Exploring ${featureTitle} feature...`);
                });
            });
            
            // Feedback functionality
            const feedbackIcon = document.getElementById('feedbackIcon');
            const feedbackModal = document.getElementById('feedbackModal');
            const closeModal = document.getElementById('closeModal');
            const feedbackForm = document.getElementById('feedbackForm');
            const ratingStars = document.querySelectorAll('.star');
            const ratingValue = document.getElementById('ratingValue');
            const submitBtn = document.getElementById('submitBtn');
            
            let selectedRating = 0;
            
            // Open feedback modal
            feedbackIcon.addEventListener('click', function() {
                feedbackModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            });
            
            // Close feedback modal
            closeModal.addEventListener('click', function() {
                feedbackModal.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            });
            
            // Close modal when clicking outside
            feedbackModal.addEventListener('click', function(e) {
                if (e.target === feedbackModal) {
                    feedbackModal.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scrolling
                }
            });
            
            // Star rating functionality
            ratingStars.forEach(star => {
                star.addEventListener('click', function() {
                    selectedRating = parseInt(this.getAttribute('data-rating'));
                    updateStarRating(selectedRating);
                });
                
                star.addEventListener('mouseover', function() {
                    const hoverRating = parseInt(this.getAttribute('data-rating'));
                    updateStarRating(hoverRating, false);
                });
                
                star.addEventListener('mouseout', function() {
                    updateStarRating(selectedRating);
                });
            });
            
            function updateStarRating(rating, permanent = true) {
                ratingStars.forEach(star => {
                    const starRating = parseInt(star.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
                
                if (permanent) {
                    ratingValue.textContent = `${rating}/5`;
                }
            }
            
            // Form submission
            if (feedbackForm) {
                feedbackForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Validate rating
                    if (selectedRating === 0) {
                        showNotification('Please select a rating before submitting.', 4000);
                        return;
                    }
                    
                    // Get form data
                    const formData = new FormData(this);
                    const name = document.getElementById('name').value;
                    const email = document.getElementById('email').value;
                    const feedbackType = document.getElementById('feedbackType').value;
                    const message = document.getElementById('message').value;
                    const subscribe = document.getElementById('subscribe').checked;
                    
                    // Show loading state
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission
                    setTimeout(() => {
                        // Show success message
                        showNotification('Thank you for your feedback! We appreciate your input and will use it to improve MovieMate.', 5000);
                        
                        // Reset form
                        feedbackForm.reset();
                        selectedRating = 0;
                        updateStarRating(0);
                        
                        // Close modal
                        feedbackModal.classList.remove('active');
                        document.body.style.overflow = ''; // Restore scrolling
                        
                        // Reset button
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                });
            }
            
            // Notification system
            function showNotification(message, duration = 3000) {
                // Remove existing notification
                const existingNotification = document.querySelector('.custom-notification');
                if (existingNotification) {
                    existingNotification.remove();
                }
                
                // Create notification element
                const notification = document.createElement('div');
                notification.className = 'custom-notification';
                notification.innerHTML = `
                    <div class="notification-content">
                        <i class="fas fa-info-circle"></i>
                        <span>${message}</span>
                    </div>
                `;
                
                // Add styles
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--card);
                    color: var(--text);
                    padding: 15px 20px;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    border: 1px solid var(--bg-light);
                    z-index: 1000;
                    transform: translateX(400px);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                `;
                
                document.body.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.style.transform = 'translateX(0)';
                }, 100);
                
                // Auto remove after duration
                setTimeout(() => {
                    notification.style.transform = 'translateX(400px)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }, duration);
                
                // Click to dismiss
                notification.addEventListener('click', () => {
                    notification.style.transform = 'translateX(400px)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                });
            }
            
            // Keyboard navigation
            document.addEventListener('keydown', function(e) {
                // Escape key to close notifications or clear search
                if (e.key === 'Escape') {
                    if (searchInput) searchInput.blur();
                    const notification = document.querySelector('.custom-notification');
                    if (notification) {
                        notification.remove();
                    }
                    
                    // Close feedback modal if open
                    if (feedbackModal.classList.contains('active')) {
                        feedbackModal.classList.remove('active');
                        document.body.style.overflow = ''; // Restore scrolling
                    }
                }
                
                // Enter key on search
                if (e.key === 'Enter' && searchInput && document.activeElement === searchInput) {
                    const query = searchInput.value.trim();
                    if (query) {
                        alert(`Searching for: ${query}`);
                        // Implement search action
                    }
                }
            });
            
            // Performance optimization: Intersection Observer for lazy loading
            if ('IntersectionObserver' in window) {
                const lazyLoader = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                lazyLoader.unobserve(img);
                            }
                        }
                    });
                });
                
                // Observe images that should be lazy loaded
                document.querySelectorAll('img[data-src]').forEach(img => {
                    lazyLoader.observe(img);
                });
            }

            // Smooth scrolling for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });