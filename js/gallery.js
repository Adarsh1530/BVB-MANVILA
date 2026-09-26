/**
 * Bhavan's Vivekananda Vidya Mandir - Interactive Gallery & Lightbox Engine
 * Category Filtering, Lightbox Zoom, Prev/Next, Keyboard Navigation, Mobile Swipe
 * Dynamic Counter Format: 1 / N
 */

document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lightbox = document.getElementById('gallery-lightbox');

  let activeFilter = 'all';

  function getGalleryItems() {
    return Array.from(document.querySelectorAll('.gallery-grid .gallery-item'));
  }

  // 1. Filtering Logic
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeFilter = btn.getAttribute('data-filter') || 'all';
      applyFilter();
    });
  });

  function applyFilter() {
    const items = getGalleryItems();
    items.forEach(item => {
      const categories = (item.getAttribute('data-category') || 'all').split(' ');
      if (activeFilter === 'all' || categories.includes(activeFilter)) {
        item.classList.remove('hidden');
        item.style.display = '';
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        }, 10);
      } else {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
          item.classList.add('hidden');
          item.style.display = 'none';
        }, 200);
      }
    });
  }

  // 2. Lightbox Engine
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let visibleItems = [];
  let currentIndex = 0;

  const updateVisibleItems = () => {
    const items = getGalleryItems();
    visibleItems = items.filter(item => {
      return !item.classList.contains('hidden') && getComputedStyle(item).display !== 'none';
    });
  };

  const openLightbox = (index) => {
    updateVisibleItems();
    if (!visibleItems.length) return;

    if (index < 0) index = visibleItems.length - 1;
    if (index >= visibleItems.length) index = 0;

    currentIndex = index;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    if (!img) return;

    const title = item.getAttribute('data-title') || img.getAttribute('alt') || 'Campus Moment';
    const category = item.getAttribute('data-category-label') || 'Gallery';

    lightboxImg.src = img.src;
    lightboxImg.alt = title;
    if (lightboxCaption) {
      lightboxCaption.textContent = `${category} — ${title}`;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentIndex + 1} / ${visibleItems.length}`;
    }
    lightboxImg.classList.remove('zoomed');

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightboxImg.classList.remove('zoomed');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    if (!visibleItems.length) return;
    openLightbox(currentIndex + 1);
  };

  const showPrev = () => {
    if (!visibleItems.length) return;
    openLightbox(currentIndex - 1);
  };

  // Event Delegation for clicking any gallery item (static or dynamically added)
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-grid .gallery-item');
    if (item) {
      updateVisibleItems();
      const idx = visibleItems.indexOf(item);
      if (idx !== -1) {
        openLightbox(idx);
      }
    }
  });

  // Lightbox Controls
  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  // Close when clicking outside dialog
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Zoom on image click
  if (lightboxImg) {
    lightboxImg.addEventListener('click', (e) => {
      e.stopPropagation();
      lightboxImg.classList.toggle('zoomed');
    });
  }

  // Keyboard navigation: Escape, ArrowLeft, ArrowRight
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext();
    } else if (e.key === 'ArrowLeft') {
      showPrev();
    }
  });

  // Mobile Touch Swipe Navigation
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  const handleSwipe = () => {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      showNext();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      showPrev();
    }
  };

  // Listen for custom event when gallery grid is dynamically updated
  window.addEventListener('galleryUpdated', () => {
    applyFilter();
  });
});
