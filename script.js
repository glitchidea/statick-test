// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
});

// Typing effect for hero title
document.addEventListener('DOMContentLoaded', function() {
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const text = typingText.textContent;
        typingText.textContent = '';
        
        let index = 0;
        function typeChar() {
            if (index < text.length) {
                typingText.textContent += text[index];
                index++;
                setTimeout(typeChar, 100);
            } else {
                // Add blinking cursor effect
                typingText.style.borderRight = '2px solid #22c55e';
                typingText.style.animation = 'blink 1s infinite';
            }
        }
        
        // Start typing after a short delay
        setTimeout(typeChar, 500);
    }
});

// Add blinking cursor animation
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes blink {
            0%, 50% { border-color: #22c55e; }
            51%, 100% { border-color: transparent; }
        }
    `;
    document.head.appendChild(style);
});

// Code editor typing simulation
document.addEventListener('DOMContentLoaded', function() {
    const codeLines = document.querySelectorAll('.code-line');
    
    if (codeLines.length > 0) {
        // Hide all lines initially
        codeLines.forEach(line => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
        });
        
        // Animate lines one by one
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.transition = 'all 0.5s ease';
                line.style.opacity = '1';
                line.style.transform = 'translateX(0)';
            }, index * 200 + 1000);
        });
    }
});

// Project card interactions
document.addEventListener('DOMContentLoaded', function() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Add glow effect
            this.style.boxShadow = '0 8px 32px rgba(34, 197, 94, 0.2), 0 0 0 1px rgba(34, 197, 94, 0.3)';
        });
        
        card.addEventListener('mouseleave', function() {
            // Remove glow effect
            this.style.boxShadow = '';
        });
    });
    
    // Handle project action buttons
    const githubBtns = document.querySelectorAll('.btn-github');
    const demoBtns = document.querySelectorAll('.btn-demo');
    const licenseBtns = document.querySelectorAll('.btn-license');
    
    githubBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Simulate GitHub redirect
            showNotification('GitHub repository açılıyor...', 'info');
            setTimeout(() => {
                window.open('https://github.com', '_blank');
            }, 1000);
        });
    });
    
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Demo sayfası hazırlanıyor...', 'info');
        });
    });
    
    licenseBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Lisans detayları gösteriliyor...', 'info');
        });
    });
});

// License card hover effects
document.addEventListener('DOMContentLoaded', function() {
    const licenseCards = document.querySelectorAll('.license-card');
    
    licenseCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.license-header i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.license-header i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});

// Stats counter animation
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number, .hero-stats .stat-number, .github-stats .number');
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
    
    function animateCounter(element) {
        const target = element.textContent;
        const hasPlus = target.includes('+');
        const hasK = target.includes('K');
        const isDotted = target.includes('.');
        
        let numericTarget;
        if (isDotted) {
            numericTarget = parseFloat(target.replace(/[^\d.]/g, ''));
        } else {
            numericTarget = parseInt(target.replace(/\D/g, ''));
        }
        
        if (hasK) {
            numericTarget = numericTarget * 1000;
        }
        
        const duration = 2000;
        const increment = numericTarget / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= numericTarget) {
                current = numericTarget;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (hasK && displayValue >= 1000) {
                displayValue = (displayValue / 1000).toFixed(1) + 'K';
            }
            
            element.textContent = displayValue + (hasPlus ? '+' : '');
        }, 16);
    }
});

// Form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const company = this.querySelectorAll('input[type="text"]')[1].value;
            const subject = this.querySelector('select').value;
            const message = this.querySelector('textarea').value;
            const agreement = this.querySelector('input[type="checkbox"]').checked;
            
            // Validation
            if (!name || !email || !subject || !message) {
                showNotification('Lütfen gerekli alanları doldurun.', 'error');
                return;
            }
            
            if (!agreement) {
                showNotification('Lütfen açık kaynak kurallarını kabul edin.', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Geçerli bir e-posta adresi girin.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Gönderiliyor...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fab fa-github"></i> GitHub\'da İşleniyor...';
                
                setTimeout(() => {
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Gönderildi!';
                    showNotification(`Merhaba ${name}! Mesajınız başarıyla gönderildi. ${subject === 'contribution' ? 'GitHub issues sayfasından takip edebilirsiniz.' : 'En kısa sürede size dönüş yapacağım.'}`, 'success');
                    
                    // Reset form
                    this.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1500);
            }, 2000);
        });
    }
});

// Notification system with GitHub-style design
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-triangle', 
        info: 'fa-info-circle'
    };
    
    const colorMap = {
        success: '#22c55e',
        error: '#f87171',
        info: '#3b82f6'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconMap[type]}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add GitHub-style notification design
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid ${colorMap[type]};
        color: var(--text-primary);
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
        backdrop-filter: blur(20px);
        font-family: 'Inter', sans-serif;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-content i:first-child').style.cssText = `
        color: ${colorMap[type]};
        margin-top: 0.1rem;
        flex-shrink: 0;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: var(--text-secondary);
        cursor: pointer;
        padding: 0;
        margin-left: auto;
        font-size: 0.9rem;
        transition: color 0.3s ease;
        flex-shrink: 0;
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.color = colorMap[type];
    });
    
    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.color = 'var(--text-secondary)';
    });
    
    // Auto remove after 6 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 6000);
}

// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add special effects for different elements
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.transition = 'all 0.6s ease';
                } else if (entry.target.classList.contains('license-card')) {
                    entry.target.style.transition = 'all 0.5s ease';
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const elementsToAnimate = document.querySelectorAll(
        '.project-card, .license-card, .stat-card, .contact-item, .platform-link, .step'
    );
    
    elementsToAnimate.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(element);
    });
});

// Floating badges animation in hero
document.addEventListener('DOMContentLoaded', function() {
    const floatingBadges = document.querySelectorAll('.floating-badge');
    
    floatingBadges.forEach((badge, index) => {
        // Add initial animation delay
        badge.style.animationDelay = `${index * 2}s`;
        
        // Add hover effect
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
});

// Community platform links interaction
document.addEventListener('DOMContentLoaded', function() {
    const platformLinks = document.querySelectorAll('.platform-link');
    
    platformLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.querySelector('h4').textContent;
            showNotification(`${platform} sayfası açılıyor...`, 'info');
            
            // Simulate external link opening
            setTimeout(() => {
                const urls = {
                    'GitHub': 'https://github.com',
                    'Discord': 'https://discord.gg',
                    'Twitter': 'https://twitter.com',
                    'LinkedIn': 'https://linkedin.com'
                };
                if (urls[platform]) {
                    window.open(urls[platform], '_blank');
                }
            }, 1000);
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(13, 17, 23, 0.98)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(13, 17, 23, 0.95)';
    }
});

// License badge hover effects
document.addEventListener('DOMContentLoaded', function() {
    const licenseBadges = document.querySelectorAll('.license-badge');
    
    licenseBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });
        
        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// Project filtering (future enhancement)
document.addEventListener('DOMContentLoaded', function() {
    // This could be extended to add filtering by license type, technology, etc.
    const projectCards = document.querySelectorAll('.project-card');
    
    // Add search functionality if needed
    function filterProjects(searchTerm) {
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm.toLowerCase()) ||
                          description.includes(searchTerm.toLowerCase()) ||
                          techTags.some(tag => tag.includes(searchTerm.toLowerCase()));
            
            if (matches) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Expose filter function globally for potential use
    window.filterProjects = filterProjects;
});

// Contribution steps animation
document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step');
    
    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                    
                    // Animate step number
                    const stepNumber = entry.target.querySelector('.step-number');
                    if (stepNumber) {
                        stepNumber.style.animation = 'pulse 0.6s ease';
                    }
                }, index * 200);
                
                stepObserver.unobserve(entry.target);
            }
        });
    });
    
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateX(-20px)';
        step.style.transition = 'all 0.6s ease';
        stepObserver.observe(step);
    });
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
});

// Loading animation
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
    
    // Hide loading screen if exists
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
    }
    
    // Start hero animations
    setTimeout(() => {
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (heroContent) heroContent.style.opacity = '1';
        if (heroVisual) heroVisual.style.opacity = '1';
    }, 100);
}); 