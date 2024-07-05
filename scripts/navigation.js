const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.site-navigation-list');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('active');
  menuToggle.textContent = menu.classList.contains('active') ? 'close' : 'menu';
});
