// Dynamically update copyright year
document.addEventListener('DOMContentLoaded', function() {
  const footerBottom = document.querySelector('.footer-bottom');

  if (footerBottom) {
    const currentYear = new Date().getFullYear();
    footerBottom.textContent = '© kuwona ' + currentYear;
  }
});
