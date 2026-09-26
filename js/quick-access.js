/**
 * Quick Access Widget for Desktop Floating Panel and Mobile App-style Bottom Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile bottom bar active item sync
  const bottomBarItems = document.querySelectorAll('.mobile-bottom-item');
  const currentPath = window.location.pathname;

  bottomBarItems.forEach(item => {
    const href = item.getAttribute('href');
    if (href && (currentPath.endsWith(href) || (href === 'index.html' && (currentPath === '/' || currentPath.endsWith('/'))))) {
      bottomBarItems.forEach(b => b.classList.remove('active'));
      item.classList.add('active');
    }
  });
});
