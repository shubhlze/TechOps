(function () {
  'use strict';

  // DOM Elements
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  const navLinks = document.querySelectorAll('.primary-nav a');
  const contactForm = document.getElementById('contact-form');
  const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

  // Initialize
  function init() {
    setupEventListeners();
    setupScrollEffects();
    setupFormValidation();
    setupScrollReveal();
    highlightActiveNav();
  }

  // Event Listeners
  function setupEventListeners() {
    // Mobile navigation toggle
    if (navToggle) {
      navToggle.addEventListener('click', toggleMobileNav);
    }

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Header shrink on scroll
    window.addEventListener('scroll', handleHeaderScroll);

    // ESC key to close mobile menu
    document.addEventListener('keydown', handleKeydown);

    // Window resize to close mobile menu
    window.addEventListener('resize', handleResize);

    // Form submission
    if (contactForm) {
      contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Intersection Observer for scroll animations
    setupIntersectionObserver();
  }

  // Mobile Navigation
  function toggleMobileNav() {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('active');
    
    // Animate toggle button
    navToggle.classList.toggle('active');
  }

  // Header Scroll Effects
  function handleHeaderScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  // Smooth Scrolling
  function handleSmoothScroll(e) {
    const href = e.currentTarget.getAttribute('href');
    
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (primaryNav.classList.contains('active')) {
          toggleMobileNav();
        }
      }
    }
  }

  // Keydown Handler
  function handleKeydown(e) {
    if (e.key === 'Escape' && primaryNav.classList.contains('active')) {
      toggleMobileNav();
    }
  }

  // Resize Handler
  function handleResize() {
    if (window.innerWidth > 768 && primaryNav.classList.contains('active')) {
      toggleMobileNav();
    }
  }

  // Active Navigation Highlighting
  function highlightActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.primary-nav a[href^="#"]');
    
    window.addEventListener('scroll', () => {
      let current = '';
      const scrollPosition = window.scrollY + 200;
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          current = section.getAttribute('id');
        }
      });
      
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
          item.classList.add('active');
        }
      });
    });
  }

  // Scroll Effects
  function setupScrollEffects() {
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    if (hero) {
      window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      });
    }

    // Floating cards animation
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 2}s`;
    });
  }

  // Scroll Reveal Animation
  function setupScrollReveal() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Add staggered animation for grid items
          if (entry.target.classList.contains('cards-grid') || 
              entry.target.classList.contains('about-highlights') ||
              entry.target.classList.contains('metrics-grid') ||
              entry.target.classList.contains('testimonials-grid')) {
            const items = entry.target.querySelectorAll('.card, .highlight, .metric-card, .testimonial');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add('fade-in-up');
              }, index * 100);
            });
          }
        }
      });
    }, observerOptions);

    scrollRevealElements.forEach(el => observer.observe(el));
  }

  // Intersection Observer Setup
  function setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .highlight, .metric-card, .testimonial, .proof-item');
    animateElements.forEach(el => observer.observe(el));
  }

  // Form Validation and Submission
  function setupFormValidation() {
    if (!contactForm) return;

    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', validateField);
      input.addEventListener('input', clearFieldError);
    });
  }

  function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error styling
    field.classList.remove('error');
    
    // Validation rules
    let isValid = true;
    let errorMessage = '';
    
    switch (fieldName) {
      case 'name':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Name must be at least 2 characters long';
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;
      case 'company':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Company name must be at least 2 characters long';
        }
        break;
      case 'message':
        if (value.length < 10) {
          isValid = false;
          errorMessage = 'Message must be at least 10 characters long';
        }
        break;
    }
    
    if (!isValid) {
      showFieldError(field, errorMessage);
    }
  }

  function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorDiv);
  }

  function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = contactForm.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      validateField({ target: input });
      if (input.classList.contains('error')) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      showFormStatus('Please fix the errors above.', 'error');
      return;
    }
    
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
    
    // Collect form data
    const formData = {
      name: contactForm.querySelector('#name').value,
      email: contactForm.querySelector('#email').value,
      company: contactForm.querySelector('#company').value,
      message: contactForm.querySelector('#message').value,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    // Save to local storage
    saveInquiryToLocalStorage(formData);
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
      showFormStatus('Thank you! We\'ll get back to you within 2 hours.', 'success');
      contactForm.reset();
      
      // Reset button
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalText;
      
      // Track conversion (replace with actual analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submit', {
          'event_category': 'engagement',
          'event_label': 'contact_form'
        });
      }
    }, 2000);
  }
  
  // Save inquiry to local storage
  function saveInquiryToLocalStorage(inquiry) {
    try {
      const existingInquiries = JSON.parse(localStorage.getItem('techops_inquiries') || '[]');
      existingInquiries.push(inquiry);
      localStorage.setItem('techops_inquiries', JSON.stringify(existingInquiries));
      console.log('Inquiry saved to local storage:', inquiry);
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }
  
  // Get all saved inquiries
  function getSavedInquiries() {
    try {
      return JSON.parse(localStorage.getItem('techops_inquiries') || '[]');
    } catch (error) {
      console.error('Error reading from local storage:', error);
      return [];
    }
  }
  
  // Display saved inquiries (for admin purposes)
  function displaySavedInquiries() {
    const inquiries = getSavedInquiries();
    if (inquiries.length > 0) {
      console.log('Saved inquiries:', inquiries);
      // You can create a hidden admin panel to view these
    }
  }

  function showFormStatus(message, type) {
    const statusDiv = contactForm.querySelector('.form-status');
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = `form-status ${type}`;
      
      // Auto-hide success messages
      if (type === 'success') {
        setTimeout(() => {
          statusDiv.textContent = '';
          statusDiv.className = 'form-status';
        }, 5000);
      }
    }
  }

  // Enhanced Button Interactions
  function setupButtonInteractions() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
      
      button.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(0) scale(0.98)';
      });
      
      button.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-2px) scale(1.02)';
      });
    });
  }

  // Card Hover Effects
  function setupCardEffects() {
    const cards = document.querySelectorAll('.card, .highlight, .metric-card, .testimonial');
    
    cards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
    });
  }

  // Performance Optimization
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Optimized scroll handlers
  const optimizedScrollHandler = debounce(handleHeaderScroll, 10);
  window.addEventListener('scroll', optimizedScrollHandler);

  // Initialize everything when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Additional initialization after window load
  window.addEventListener('load', () => {
    setupButtonInteractions();
    setupCardEffects();
    
    // Add loading animation to page
    document.body.classList.add('loaded');
  });

  // Export functions for global access if needed
  window.TechOps = {
    toggleMobileNav,
    handleSmoothScroll,
    showFormStatus
  };

})();


