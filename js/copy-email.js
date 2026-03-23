// Copy email to clipboard functionality with contextual tooltip
document.addEventListener('DOMContentLoaded', function() {
  const emailLinks = document.querySelectorAll('.copy-email');

  // Create tooltip notification element
  const tooltip = document.createElement('div');
  tooltip.className = 'email-tooltip';
  tooltip.style.cssText = `
    position: absolute;
    background-color: #596A6A;
    color: #F2FBFB;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: 'Satoshi-Variable', sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    z-index: 10000;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    white-space: nowrap;
  `;
  document.body.appendChild(tooltip);

  emailLinks.forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const email = this.getAttribute('data-email');

      // Copy to clipboard
      navigator.clipboard.writeText(email).then(function() {
        // Position tooltip above the clicked link
        const rect = link.getBoundingClientRect();
        tooltip.textContent = 'copied';
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + window.scrollY + 'px';
        tooltip.style.opacity = '1';

        // Hide after 1.5 seconds
        setTimeout(function() {
          tooltip.style.opacity = '0';
        }, 1500);
      }).catch(function(err) {
        console.error('Failed to copy email:', err);
        // Fallback: show email in tooltip
        const rect = link.getBoundingClientRect();
        tooltip.textContent = email;
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + window.scrollY + 'px';
        tooltip.style.opacity = '1';

        setTimeout(function() {
          tooltip.style.opacity = '0';
        }, 2500);
      });
    });
  });
});
