/**
 * Bhavan's Vivekananda Vidya Mandir - Interactive Gallery & Lightbox Engine
 * Category Filtering, Lightbox Zoom, Sub-Images Lightbox Viewer (1 Main + 5 Sub Images)
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

  // 2. Sub-Image Package Lightbox Engine
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const lightboxCounter = lightbox.querySelector('.lightbox-counter');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentPackageImages = [];
  let currentSubIndex = 0;

  const openPackageLightbox = (pkg, subIndex = 0) => {
    // Package image sequence: Main Image first, followed by up to 5 sub-images
    const allImages = [pkg.main_image, ...(pkg.sub_images || [])].filter(img => img && img.trim() !== '');

    currentPackageImages = allImages;
    currentSubIndex = subIndex;

    if (currentSubIndex < 0) currentSubIndex = currentPackageImages.length - 1;
    if (currentSubIndex >= currentPackageImages.length) currentSubIndex = 0;

    const imgSrc = currentPackageImages[currentSubIndex];
    const isMain = currentSubIndex === 0;
    const imgTypeLabel = isMain ? 'MAIN HIGHLIGHT' : `SUB IMAGE ${currentSubIndex} of ${currentPackageImages.length - 1}`;

    const isDirectPath = imgSrc.startsWith('http') || imgSrc.startsWith('/') || imgSrc.startsWith('assets') || imgSrc.startsWith('images') || imgSrc.startsWith('data:');
    lightboxImg.src = isDirectPath ? imgSrc : `/${imgSrc}`;
    lightboxImg.alt = pkg.title;

    if (lightboxCaption) {
      lightboxCaption.textContent = `${pkg.title} (${imgTypeLabel})`;
    }
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentSubIndex + 1} / ${currentPackageImages.length}`;
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
    if (!currentPackageImages.length) return;
    openPackageLightboxCurrent(currentSubIndex + 1);
  };

  const showPrev = () => {
    if (!currentPackageImages.length) return;
    openPackageLightboxCurrent(currentSubIndex - 1);
  };

  const openPackageLightboxCurrent = (newIdx) => {
    if (newIdx < 0) newIdx = currentPackageImages.length - 1;
    if (newIdx >= currentPackageImages.length) newIdx = 0;

    currentSubIndex = newIdx;
    const imgSrc = currentPackageImages[currentSubIndex];
    const isMain = currentSubIndex === 0;
    const imgTypeLabel = isMain ? 'MAIN HIGHLIGHT' : `SUB GALLERY IMAGE ${currentSubIndex}`;

    lightboxImg.src = imgSrc;
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentSubIndex + 1} / ${currentPackageImages.length}`;
    }
  };

  // Event Delegation for gallery items
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.gallery-grid .gallery-item');
    if (item) {
      const pkgId = item.getAttribute('data-package-id');
      if (pkgId && window.bvbImagePackages) {
        const pkg = window.bvbImagePackages.find(p => p.id == pkgId);
        if (pkg) {
          openPackageLightbox(pkg, 0);
          return;
        }
      }

      // Default fallback if non-packaged gallery item
      const img = item.querySelector('img');
      if (img) {
        currentPackageImages = [img.src];
        currentSubIndex = 0;
        lightboxImg.src = img.src;
        if (lightboxCaption) lightboxCaption.textContent = item.getAttribute('data-title') || 'Gallery Moment';
        if (lightboxCounter) lightboxCounter.textContent = '1 / 1';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  window.addEventListener('galleryUpdated', () => {
    applyFilter();
  });
});
