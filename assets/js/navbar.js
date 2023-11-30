// Mobile menu toggle functionality
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const menuItems = document.getElementById('menu-items');
const responsiveMenu = document.getElementById('responsive-menu');

mobileMenuToggle.addEventListener('click', () => {
  responsiveMenu.classList.toggle('hidden');
});

// Hide responsive menu when clicking outside
document.addEventListener('click', (event) => {
  const isClickInsideToggle = mobileMenuToggle.contains(event.target);

  if (!isClickInsideToggle) {
    responsiveMenu.classList.add('hidden');
  }
});

// Update menu visibility on window resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768) {
    responsiveMenu.classList.add('hidden');
  }
});
