export function galleryInit() {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', () => {
      // Stop JavaScript-based animations.
    });
    const sectionEl = document.querySelector('#photos-section');
    const photoEls = document.querySelectorAll('.photo');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    let photos = JSON.parse(sectionEl.dataset.photos);
    // save to sessionStorage
    sessionStorage.setItem('photos', JSON.stringify(photos));
    let index = 0;
    let duration;
    if (mediaQuery.matches) {
      duration = 0;
    } else {
      duration = 1000;
    }
    // photo square 0
    const photoFadeRight = [
      { opacity: 1, transform: 'translateX(0%)' },
      { opacity: 0, transform: 'translateX(100%)' },
      { opacity: 0, transform: 'translateX(-100%)' },
      { opacity: 1, transform: 'translateX(0%)' },
    ];
    const photoFadeLeft = [
      { opacity: 1, transform: 'translateX(0%)' },
      { opacity: 0, transform: 'translateX(-100%)' },
      { opacity: 0, transform: 'translateX(100%)' },
      { opacity: 1, transform: 'translateX(0%)' },
    ];
    // photo square 1
    const photoFadeRightUp = [
      { opacity: 1, transform: 'translateX(0%)' },
      { opacity: 0, transform: 'translateX(100%)' },
      { opacity: 0, transform: 'translateX(0%) translateY(100%)' },
      { opacity: 1, transform: 'translateY(0%)' },
    ];
    const photoFadeDownLeft = [
      { opacity: 1, transform: 'translateY(0%)' },
      { opacity: 0, transform: 'translateY(100%)' },
      { opacity: 0, transform: 'translateX(100%) translateY(0%)' },
      { opacity: 1, transform: 'translateX(0%)' },
    ];
    // photo square 2
    const photoFadeUpLeft = [
      { opacity: 1, transform: 'translateY(0%)' },
      { opacity: 0, transform: 'translateY(-100%)' },
      { opacity: 0, transform: 'translateX(100%) translateY(0%)' },
      { opacity: 1, transform: 'translateX(0%)' },
    ];
    const photoFadeRightDown = [
      { opacity: 1, transform: 'translateX(0%)' },
      { opacity: 0, transform: 'translateX(100%)' },
      { opacity: 0, transform: 'translateX(0%) translateY(-100%)' },
      { opacity: 1, transform: 'translateY(0%)' },
    ];
    // photo square 3
    const photoFadeLeftDown = [
      { opacity: 1, transform: 'translateX(0%)' },
      { opacity: 0, transform: 'translateX(-100%)' },
      { opacity: 0, transform: 'translateX(0%) translateY(-100%)' },
      { opacity: 1, transform: 'translateY(0%)' },
    ];
    const photoFadeUpRight = [
      { opacity: 1, transform: 'translateY(0%)' },
      { opacity: 0, transform: 'translateY(-100%)' },
      { opacity: 0, transform: 'translateX(-100%) translateY(0%)' },
      { opacity: 1, transform: 'translateX(0%)' },
    ];
    // photo square 4
    const photoFadeDownIn = [
      { opacity: 1, transform: 'translateY(0%)' },
      { opacity: 0, transform: 'translateY(100%)' },
      { opacity: 0, transform: 'translateX(0%) translateY(0%)' },
      { opacity: 1, transform: 'translateX(0%) translateY(0%)' },
    ];
    const photoFadeOutUp = [
      { opacity: 1, transform: 'translateX(0%) translateY(0%)' },
      { opacity: 0, transform: 'translateX(0%) translateY(0%)' },
      { opacity: 0, transform: 'translateX(0%) translateY(100%)' },
      { opacity: 1, transform: 'translateY(0%)' },
    ];
    const photoTiming = {
      duration: duration,
      iterations: 1,
    };
    
    function clickHandler(amount) {
      if (index + 5 === photos.length) {
        photos = [...photos, ...photos];
      }
      index = index + amount;
      if (index < 0) {
        index = photos.length - 1;
        photos = [...photos, ...photos];
      }
      if (amount === 1) {
        photoEls[0].animate(photoFadeRight, photoTiming);
      } else {
        photoEls[0].animate(photoFadeLeft, photoTiming);
      }
      setTimeout(() => {
        photoEls[0].innerHTML = `<a href="${photos[index].filename}"><img src=${photos[index].url} alt=${photos[index].altText} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[1].animate(photoFadeRightUp, photoTiming);
      } else {
        photoEls[1].animate(photoFadeDownLeft, photoTiming);
      }
      setTimeout(() => {
        photoEls[1].innerHTML = `<a href="${photos[index + 1].filename}"><img src=${
          photos[index + 1].url
        } alt=${photos[index + 1].altText} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[2].animate(photoFadeUpLeft, photoTiming);
      } else {
        photoEls[2].animate(photoFadeRightDown, photoTiming);
      }

      setTimeout(() => {
        photoEls[2].innerHTML = `<a href="${photos[index + 2].filename}"><img src=${
          photos[index + 2].url
        } alt=${photos[index + 2].altText} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[3].animate(photoFadeLeftDown, photoTiming);
      } else {
        photoEls[3].animate(photoFadeUpRight, photoTiming);
      }

      setTimeout(() => {
        photoEls[3].innerHTML = `<a href="${photos[index + 3].filename}"><img src=${
          photos[index + 3].url
        } alt=${photos[index + 3].altText} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[4].animate(photoFadeDownIn, photoTiming);
      } else {
        photoEls[4].animate(photoFadeOutUp, photoTiming);
      }

      setTimeout(() => {
        photoEls[4].innerHTML = `<a href="${photos[index + 4].filename}"><img src=${
          photos[index + 4].url
        } alt=${photos[index + 4].altText} /></a>`;
      }, duration / 2);
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => clickHandler(-1), false);
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => clickHandler(1), false);
    }
  
    if (prevBtn || nextBtn) {
      window.addEventListener(
        'keydown',
        (e) => {
          if (
            e.code === 'ArrowUp' ||
            e.code === 'ArrowRight' ||
            e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft'
          ) {
            if (e.code === 'ArrowRight' || e.code === 'ArrowUp') {
              clickHandler(1);
            } else if (e.code === 'ArrowLeft' || e.code === 'ArrowDown') {
              clickHandler(-1);
            }
          }
        },
        false
      );
    }
  }
  