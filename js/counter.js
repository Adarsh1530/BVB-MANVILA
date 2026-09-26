/**
 * Animated Counter Component for Statistics & Achievements
 */

document.addEventListener('DOMContentLoaded', () => {
  const counterElements = document.querySelectorAll('.counter-val');
  if (!counterElements.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.getAttribute('data-target'));
    const isDecimal = el.getAttribute('data-target').includes('.');
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Easing out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const currentValue = target * easedProgress;

      if (isDecimal) {
        el.textContent = `${prefix}${currentValue.toFixed(2)}${suffix}`;
      } else {
        el.textContent = `${prefix}${Math.floor(currentValue)}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        el.textContent = `${prefix}${isDecimal ? target.toFixed(2) : target}${suffix}`;
      }
    };

    requestAnimationFrame(updateValue);
  };

  const observerOptions = {
    threshold: 0.3
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counterElements.forEach(counter => {
    observer.observe(counter);
  });
});
