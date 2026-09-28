/**
 * Bhavan's Vivekananda Vidya Mandir, Manvila
 * Main JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Elevation on Scroll
  const header = document.querySelector('.main-header');
  const scrollToTopBtn = document.querySelector('.scroll-to-top');

  const handleScroll = () => {
    const scrollPos = window.scrollY;
    if (header) {
      if (scrollPos > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (scrollToTopBtn) {
      if (scrollPos > 400) {
        scrollToTopBtn.classList.add('active');
      } else {
        scrollToTopBtn.classList.remove('active');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Scroll to Top Button Action
  if (scrollToTopBtn) {
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 3. Mobile Offcanvas Navigation Drawer
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerOverlay = document.querySelector('.mobile-drawer-overlay');
  const drawerClose = document.querySelector('.drawer-close');

  const openDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    if (mobileToggle) mobileToggle.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    if (mobileDrawer) mobileDrawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    if (mobileToggle) mobileToggle.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on clicking links inside mobile nav
  document.querySelectorAll('.mobile-nav-item a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // 4. Modal System (Principal Message, Event Details)
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const contentModals = document.querySelectorAll('.content-modal');

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-modal-target');
      const targetModal = document.getElementById(targetId);
      if (targetModal) {
        targetModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = (modal) => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  modalCloseBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.content-modal');
      if (modal) closeModal(modal);
    });
  });

  contentModals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // 5. Contact / Enquiry Form Interactive Feedback
  const contactForms = document.querySelectorAll('.js-contact-form');
  contactForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Message...';

      setTimeout(() => {
        submitBtn.innerHTML = '✓ Message Sent Successfully!';
        submitBtn.style.backgroundColor = '#10B981';
        form.reset();

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.backgroundColor = '';
        }, 4000);
      }, 1200);
    });
  });

  // 6. Hero 5-Image Auto-Slider Engine
  let autoSlideInterval = null;
  function initHeroSlider() {
    const heroSliderBox = document.getElementById('heroImgBox');
    const heroSlides = document.querySelectorAll('.hero-slide');
    const sliderDots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.getElementById('heroSliderPrev');
    const nextBtn = document.getElementById('heroSliderNext');

    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
      autoSlideInterval = null;
    }

    if (heroSlides.length > 0) {
      let currentSlide = 0;
      const slideDuration = 4000; // 4 seconds per slide

      const goToSlide = (index) => {
        heroSlides.forEach(s => s.classList.remove('active'));
        sliderDots.forEach(d => d.classList.remove('active'));

        currentSlide = (index + heroSlides.length) % heroSlides.length;

        if (heroSlides[currentSlide]) heroSlides[currentSlide].classList.add('active');
        if (sliderDots[currentSlide]) sliderDots[currentSlide].classList.add('active');
      };

      const nextSlide = () => goToSlide(currentSlide + 1);
      const prevSlide = () => goToSlide(currentSlide - 1);

      const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, slideDuration);
      };

      const stopAutoSlide = () => {
        if (autoSlideInterval) {
          clearInterval(autoSlideInterval);
          autoSlideInterval = null;
        }
      };

      // Attach Event Listeners
      if (prevBtn) {
        prevBtn.onclick = () => {
          prevSlide();
          startAutoSlide();
        };
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          nextSlide();
          startAutoSlide();
        };
      }

      sliderDots.forEach((dot, idx) => {
        dot.onclick = () => {
          goToSlide(idx);
          startAutoSlide();
        };
      });

      if (heroSliderBox) {
        heroSliderBox.onmouseenter = stopAutoSlide;
        heroSliderBox.onmouseleave = startAutoSlide;

        // Touch / Swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        heroSliderBox.ontouchstart = (e) => {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoSlide();
        };

        heroSliderBox.ontouchend = (e) => {
          touchEndX = e.changedTouches[0].screenX;
          const diff = touchEndX - touchStartX;
          if (Math.abs(diff) > 40) {
            if (diff < 0) nextSlide();
            else prevSlide();
          }
          startAutoSlide();
        };
      }

      // Start Auto Play
      startAutoSlide();
    }
  }

  initHeroSlider();
  window.addEventListener('heroSlidesUpdated', initHeroSlider);
});
