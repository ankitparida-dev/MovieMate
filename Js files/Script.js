// Simple loading simulation
        document.addEventListener('DOMContentLoaded', function() {
            const loadingScreen = document.getElementById('loadingScreen');
            const progressBar = document.getElementById('progressBar');
            const loadedPercent = document.getElementById('loadedPercent');
            const mainContent = document.getElementById('mainContent');
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 10;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    
                    setTimeout(() => {
                        loadingScreen.classList.add('hidden');
                        mainContent.style.display = 'block';
                        
                        // Start typing animation after loading
                        startTypingAnimation();
                    }, 500);
                }
                
                progressBar.style.width = `${progress}%`;
                loadedPercent.textContent = `${Math.round(progress)}%`;
            }, 200);
            
            // Typing Animation Function
            function startTypingAnimation() {
                const typeText = document.getElementById('type-text');
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
                
                function type() {
                    const currentText = texts[textIndex];
                    
                    if (isDeleting) {
                        // Delete text
                        typeText.textContent = currentText.substring(0, charIndex - 1);
                        charIndex--;
                    } else {
                        // Type text
                        typeText.textContent = currentText.substring(0, charIndex + 1);
                        charIndex++;
                    }
                    
                    if (!isDeleting && charIndex === currentText.length) {
                        // Pause at the end of typing
                        isDeleting = true;
                        setTimeout(type, 2000);
                    } else if (isDeleting && charIndex === 0) {
                        // Move to next text after deleting
                        isDeleting = false;
                        textIndex = (textIndex + 1) % texts.length;
                        setTimeout(type, 500);
                    } else {
                        // Continue typing/deleting
                        setTimeout(type, isDeleting ? 50 : 100);
                    }
                }
                
                // Start the typing animation
                setTimeout(type, 1000);
            }
            
            // Interactive elements
            const interactiveFeatures = document.querySelectorAll('.interactive-feature');
            interactiveFeatures.forEach(feature => {
                feature.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                });
                
                feature.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
            
            // Search functionality
            const searchInput = document.querySelector('.search-input');
            searchInput.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            searchInput.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
            
            // Interstellar section functionality
            const prevBtn = document.querySelector('.prev');
            const nextBtn = document.querySelector('.next');
            const trailerBtn = document.querySelector('.trailer');
            
            prevBtn.addEventListener('click', function() {
                alert('Previous movie');
            });
            
            nextBtn.addEventListener('click', function() {
                alert('Next movie');
            });
            
            trailerBtn.addEventListener('click', function() {
                alert('Playing Interstellar trailer');
            });
            
            // Upcoming movies reminder functionality
            const remindButtons = document.querySelectorAll('.remind-btn');
            remindButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const movieTitle = this.closest('.upcoming-card').querySelector('.upcoming-title').textContent;
                    alert(`We'll remind you when "${movieTitle}" is available!`);
                });
            });
        });