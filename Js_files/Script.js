 // Loading screen functionality
        document.addEventListener('DOMContentLoaded', function() {
            const loadingScreen = document.getElementById('loadingScreen');
            const mainContent = document.getElementById('mainContent');
            const progressBar = document.getElementById('progressBar');
            const loadedPercent = document.getElementById('loadedPercent');
            
            let progress = 0;
            const totalDuration = 3000; // 3 seconds total loading time
            const intervalTime = 30; // Update every 30ms
            const increment = (intervalTime / totalDuration) * 100;

            function updateProgress() {
                progress += increment;
                if (progress > 100) {
                    progress = 100;
                }
                
                progressBar.style.width = progress + '%';
                loadedPercent.textContent = Math.round(progress) + '%';
                
                if (progress < 100) {
                    setTimeout(updateProgress, intervalTime);
                } else {
                    // When loading is complete
                    setTimeout(completeLoading, 500);
                }
            }

            function completeLoading() {
                // Add fade-out class to loading screen
                loadingScreen.classList.add('hidden');
                
                // Show main content with fade-in effect
                setTimeout(() => {
                    mainContent.style.display = 'block';
                    mainContent.style.opacity = '0';
                    
                    // Trigger reflow
                    void mainContent.offsetWidth;
                    
                    // Fade in main content
                    setTimeout(() => {
                        mainContent.style.opacity = '1';
                    }, 50);
                    
                    // Remove loading screen from DOM after transition
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 800);
                    
                    // Initialize other features after loading
                    initTypingAnimation();
                    initHeaderScroll();
                    initFeedbackModal();
                    initInteractiveCards();
                    initCarousel();
                    initNavigation();
                    initButtonInteractions();
                }, 300);
            }

            // Start the loading progress
            setTimeout(updateProgress, 500);
        });

        // Typing animation functionality
        function initTypingAnimation() {
            const texts = [
                "Cinematic Experience",
                "Movie Discovery",
                "TV Show Paradise",
                "Entertainment Hub"
            ];
            const typeTextElement = document.getElementById('type-text');
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            let typingSpeed = 100;

            function type() {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    // Deleting text
                    typeTextElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                    typingSpeed = 50;
                } else {
                    // Typing text
                    typeTextElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                    typingSpeed = 100;
                }

                // Check if text is complete
                if (!isDeleting && charIndex === currentText.length) {
                    // Pause at the end of typing
                    typingSpeed = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    // Move to next text
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    typingSpeed = 500;
                }

                setTimeout(type, typingSpeed);
            }

            // Start typing animation
            setTimeout(type, 1000);
        }

        // Header scroll effect
        function initHeaderScroll() {
            const header = document.getElementById('mainHeader');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        // Navigation functionality
        function initNavigation() {
            const navLinks = document.querySelectorAll('.nav-link');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    // Remove active class from all links
                    navLinks.forEach(item => {
                        item.classList.remove('active');
                    });
                    
                    // Add active class to clicked link
                    this.classList.add('active');
                    
                    // Get the page from data attribute
                    const page = this.getAttribute('data-page');
                    console.log(`Navigating to: ${page}`);
                    
                    // For demo purposes, we'll prevent actual navigation
                    // In a real site, these would be actual page links
                    if (page === 'home') {
                        // Already on home page
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    } else if (page === 'movies') {
                        // Navigate to movies section
                        document.querySelector('.content-section').scrollIntoView({ behavior: 'smooth' });
                    } else if (page === 'tv-shows') {
                        // Navigate to upcoming section (as placeholder for TV shows)
                        document.querySelector('.upcoming-section').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
        }

        // Button interactions
        function initButtonInteractions() {
            // Hero buttons
            const heroButtons = document.querySelectorAll('.hero-btn');
            heroButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                    
                    if (this.classList.contains('play-btn')) {
                        // Navigate to movies section
                        document.querySelector('.content-section').scrollIntoView({ behavior: 'smooth' });
                    } else if (this.classList.contains('info-btn')) {
                        // Navigate to features section
                        document.querySelector('.features-section').scrollIntoView({ behavior: 'smooth' });
                    }
                });
            });
            
            // Login button
            const loginButton = document.querySelector('.login-button .btn');
            if (loginButton) {
                loginButton.addEventListener('click', function(e) {
                    e.preventDefault();
                    alert('Opening login modal...');
                });
            }
            
            // Content card buttons
            const contentButtons = document.querySelectorAll('.content-card, .upcoming-btn, .feature-card .btn');
            contentButtons.forEach(button => {
                button.addEventListener('click', function() {
                    this.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        }

        // Feedback modal functionality
        function initFeedbackModal() {
            const feedbackIcon = document.getElementById('feedbackIcon');
            const feedbackModal = document.getElementById('feedbackModal');
            const closeModal = document.getElementById('closeModal');
            const feedbackForm = document.getElementById('feedbackForm');
            const ratingStars = document.querySelectorAll('.star');
            const ratingValue = document.getElementById('ratingValue');
            const submitBtn = document.getElementById('submitBtn');

            let currentRating = 0;

            // Star rating functionality
            ratingStars.forEach(star => {
                star.addEventListener('click', function() {
                    currentRating = parseInt(this.getAttribute('data-rating'));
                    updateRatingStars();
                });

                star.addEventListener('mouseover', function() {
                    const hoverRating = parseInt(this.getAttribute('data-rating'));
                    highlightStars(hoverRating);
                });
            });

            ratingStars.forEach(star => {
                star.addEventListener('mouseout', function() {
                    updateRatingStars();
                });
            });

            function highlightStars(rating) {
                ratingStars.forEach(star => {
                    const starRating = parseInt(star.getAttribute('data-rating'));
                    if (starRating <= rating) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                });
            }

            function updateRatingStars() {
                highlightStars(currentRating);
                ratingValue.textContent = `${currentRating}/5`;
            }

            // Modal toggle functionality
            feedbackIcon.addEventListener('click', function() {
                feedbackModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });

            closeModal.addEventListener('click', function() {
                feedbackModal.classList.remove('active');
                document.body.style.overflow = '';
            });

            // Close modal when clicking outside
            feedbackModal.addEventListener('click', function(e) {
                if (e.target === feedbackModal) {
                    feedbackModal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });

            // Form submission
            feedbackForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Disable submit button
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
                
                // Simulate form submission
                setTimeout(function() {
                    // Show success message (you can replace this with actual form submission)
                    alert('Thank you for your feedback!');
                    
                    // Reset form
                    feedbackForm.reset();
                    currentRating = 0;
                    updateRatingStars();
                    
                    // Close modal
                    feedbackModal.classList.remove('active');
                    document.body.style.overflow = '';
                    
                    // Re-enable submit button
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
                }, 2000);
            });
        }

        // Interactive cards functionality
        function initInteractiveCards() {
            const interactiveCards = document.querySelectorAll('.interactive-feature');
            
            interactiveCards.forEach(card => {
                card.addEventListener('click', function() {
                    this.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 150);
                });
            });
        }

        // Carousel functionality
        function initCarousel() {
            const carouselImage = document.getElementById('carouselImage');
            const showName = document.getElementById('showName');
            const overview = document.getElementById('overview');
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            
            const movies = [
                {
                    name: "INTERSTELLAR",
                    overview: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.",
                    background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('fHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80')"
                },
                {
                    name: "INCEPTION",
                    overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.",
                    background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('https://images.unsplash.com/photo-1489599809505-f2fbe02d41e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
                },
                {
                    name: "THE DARK KNIGHT",
                    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
                    background: "linear-gradient(rgba(10, 25, 47, 0.8), rgba(10, 25, 47, 0.8)), url('https://images.unsplash.com/photo-1531259683007-016a7b628fc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2067&q=80')"
                }
            ];
            
            let currentIndex = 0;
            
            function updateCarousel() {
                carouselImage.style.backgroundImage = movies[currentIndex].background;
                showName.textContent = movies[currentIndex].name;
                overview.textContent = movies[currentIndex].overview;
                
                // Add transition effect
                carouselImage.classList.add('changing');
                setTimeout(() => {
                    carouselImage.classList.remove('changing');
                }, 300);
            }
            
            prevBtn.addEventListener('click', function() {
                currentIndex = (currentIndex - 1 + movies.length) % movies.length;
                updateCarousel();
            });
            
            nextBtn.addEventListener('click', function() {
                currentIndex = (currentIndex + 1) % movies.length;
                updateCarousel();
            });
            
            // Initialize carousel
            updateCarousel();
        }

        // Add keyboard navigation for carousel
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') {
                document.querySelector('.prev').click();
            } else if (e.key === 'ArrowRight') {
                document.querySelector('.next').click();
            }
        });

        // Add intersection observer for animations
        function initScrollAnimations() {
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);

            // Observe elements for animation
            const animatedElements = document.querySelectorAll('.content-card, .upcoming-card, .feature-card');
            animatedElements.forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(el);
            });
        }

        // Initialize scroll animations when DOM is fully loaded
        document.addEventListener('DOMContentLoaded', function() {
            // This will be called after the loading screen completes
            setTimeout(initScrollAnimations, 1000);
        });
        // Theme toggle functionality
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        updateThemeIcon(newTheme);
        
        // Add click animation
        this.style.transform = 'scale(0.9) rotate(180deg)';
        setTimeout(() => {
            this.style.transform = '';
        }, 300);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-moon';
            themeToggle.setAttribute('aria-label', 'Switch to light theme');
        } else {
            themeIcon.className = 'fas fa-sun';
            themeToggle.setAttribute('aria-label', 'Switch to dark theme');
        }
    }
}

// Initialize theme toggle when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // This will be called after the loading screen completes
    setTimeout(initThemeToggle, 1000);
});