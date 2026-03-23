/**
 * Team Member Cards - Intersection Observer for Scroll Animations
 * Kuwona Studios
 */

document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15 // Trigger when 15% of the card is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add 'visible' class when card enters viewport
        entry.target.classList.add('visible');

        // Optional: Stop observing after animation triggers (one-time animation)
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all team member cards
  const teamCards = document.querySelectorAll('.team-member-card');
  teamCards.forEach(card => {
    observer.observe(card);
  });

  // Optional: Add click handlers for CTA buttons
  const ctaButtons = document.querySelectorAll('.team-member-cta');
  ctaButtons.forEach((button, index) => {
    button.addEventListener('click', function() {
      // You can add functionality here, for example:
      // - Open a modal with more info
      // - Scroll to contact section
      // - Navigate to a detailed profile page

      // For now, let's just log to console
      const card = this.closest('.team-member-card');
      const name = card.querySelector('.first-name').textContent + ' ' +
                   card.querySelector('.last-name').textContent;

      console.log(`Clicked on ${name}'s profile`);

      // Example: Scroll to contact section
      // window.location.href = '/contact';
    });
  });

  // Add smooth hover effect to portraits
  const portraits = document.querySelectorAll('.team-member-portrait');
  portraits.forEach(portrait => {
    portrait.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.02)';
    });

    portrait.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
});
