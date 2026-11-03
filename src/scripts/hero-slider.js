/** Hero slider (Swiper) initialisation. */
import Swiper from 'swiper';
  import { Navigation, Pagination, Autoplay } from 'swiper/modules';

  /** @type {any} */
  let heroSwiperInstance = null;

  function initSwiper() {
    /** @type {HTMLElement | null} */
    const swiperEl = document.querySelector('.hero-swiper');
    if (!swiperEl) return;

    if (heroSwiperInstance) {
      heroSwiperInstance.destroy(true, true);
      heroSwiperInstance = null;
    }

    const slidesCount = swiperEl.querySelectorAll('.swiper-slide').length;
    const hasMultipleSlides = slidesCount > 1;

    heroSwiperInstance = new Swiper('.hero-swiper', {
      modules: [Navigation, Pagination, Autoplay],
      loop: hasMultipleSlides,
      speed: 700,
      grabCursor: true,
      touchRatio: 1,
      resistanceRatio: 0.85,
      autoplay: hasMultipleSlides ? {
        delay: 5500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      } : false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: hasMultipleSlides && slidesCount > 6,
      },
      navigation: {
        prevEl: '.swiper-hero-prev',
        nextEl: '.swiper-hero-next',
      },
    });
  }

  document.addEventListener('DOMContentLoaded', initSwiper);
  document.addEventListener('astro:page-load', initSwiper);
