// Smooth Page Transitions and Enhanced Interactions
document.addEventListener('DOMContentLoaded', function() {

  // Add fade-in animation to page content on load
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    document.body.style.opacity = '1';
  }, 100);

  // Smooth scroll for internal links
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

  // Add subtle parallax effect to hero sections
  const heroSections = document.querySelectorAll('.custom-container, #digital-hero-section');
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    heroSections.forEach(section => {
      if (section) {
        section.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    });
  });

  // Intersection Observer for fade-in animations
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

  // Observe elements for fade-in
  const animateElements = document.querySelectorAll('.portfolio-item, .about-intro-section, .about-founders-section, .card');
  animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Enhanced hover effect for portfolio items
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateX(10px)';
      this.style.transition = 'transform 0.3s ease';
    });

    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateX(0)';
    });
  });

  // Cursor trail effect for digital page (optional, subtle)
  if (document.body.classList.contains('digital-page')) {
    let cursorTrail = [];
    const trailLength = 5;

    document.addEventListener('mousemove', (e) => {
      cursorTrail.push({ x: e.clientX, y: e.clientY });
      if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
      }
    });
  }
});

// Page transition on link clicks
window.addEventListener('beforeunload', function() {
  document.body.style.opacity = '0';
});
