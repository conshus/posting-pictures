export function galleryInit() {
    console.log('galleryInit!');
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    // console.log("mediaQuery: ", mediaQuery);
    mediaQuery.addEventListener('change', () => {
      console.log(mediaQuery.media, mediaQuery.matches);
      // Stop JavaScript-based animations.
    });
    const sectionEl = document.querySelector('#photos-section');
    console.log("sectionEl: ", sectionEl);
    const photoEls = document.querySelectorAll('.photo');
    const prevBtn = document.querySelector('#prev');
    const nextBtn = document.querySelector('#next');
    let photos = JSON.parse(sectionEl.dataset.photos);
    // save to sessionStorage
    console.log('does this fire?');
    sessionStorage.setItem('photos', JSON.stringify(photos));
    let index = 0;
    // let index = prevPhotoIndex;
    console.log('index: ', index);
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
    // const photoFadeInOut = [
    // 	{ opacity: 1 },
    // 	{ opacity: 0 },
    // 	{ opacity: 1 },
    // ];
    const photoFadeIn = [{ opacity: 0 }, { opacity: 1 }];
    const photoTiming = {
      duration: duration,
      iterations: 1,
    };
  
    // console.log("photos: ", photos);
    // console.log("photoEls: ", photoEls[0]);
  
    function clickHandler(amount) {
      console.log('clickHandler');
      if (index + 5 === photos.length) {
        console.log('reached the end of the photos');
        photos = [...photos, ...photos];
      }
      index = index + amount;
      if (index < 0) {
        index = photos.length - 1;
        photos = [...photos, ...photos];
      }
      // for (i=0; i<photos.length; i++){
      // 	console.log("i: ", i);
      // 	photoEls[i].animate(photoFadeInOut, photoTiming);
      // 	setTimeout(() => {
      // 				photoEls[i].innerHTML = `<a href=""><img src=${photos[index].src.large} alt=${photos[index].alt} /></a>`
      // 	}, 500);
  
      // }
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
        photoEls[1].innerHTML = `<a href="${photos[index + 1].id}"><img src=${
          photos[index + 1].src.large
        } alt=${photos[index + 1].alt} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[2].animate(photoFadeUpLeft, photoTiming);
      } else {
        photoEls[2].animate(photoFadeRightDown, photoTiming);
      }
      // photoEls[2].animate(photoFadeRight, photoTiming);
      setTimeout(() => {
        photoEls[2].innerHTML = `<a href="${photos[index + 2].id}"><img src=${
          photos[index + 2].src.large
        } alt=${photos[index + 2].alt} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[3].animate(photoFadeLeftDown, photoTiming);
      } else {
        photoEls[3].animate(photoFadeUpRight, photoTiming);
      }
      // photoEls[3].animate(photoFadeRight, photoTiming);
      setTimeout(() => {
        photoEls[3].innerHTML = `<a href="${photos[index + 3].id}"><img src=${
          photos[index + 3].src.large
        } alt=${photos[index + 3].alt} /></a>`;
      }, duration / 2);
  
      if (amount === 1) {
        photoEls[4].animate(photoFadeDownIn, photoTiming);
      } else {
        photoEls[4].animate(photoFadeOutUp, photoTiming);
      }
      // photoEls[4].animate(photoFadeRight, photoTiming);
      setTimeout(() => {
        photoEls[4].innerHTML = `<a href="${photos[index + 4].id}"><img src=${
          photos[index + 4].src.large
        } alt=${photos[index + 4].alt} /></a>`;
      }, duration / 2);
      // photoEls[0].innerHTML = `<a href=""><img src=${photos[index].src.large} alt=${photos[index].alt} /></a>`
      // photoEls[1].innerHTML = `<a href=""><img src=${photos[index+1].src.large} alt=${photos[index].alt} /></a>`
      // photoEls[2].innerHTML = `<a href=""><img src=${photos[index+2].src.large} alt=${photos[index].alt} /></a>`
      // photoEls[3].innerHTML = `<a href=""><img src=${photos[index+3].src.large} alt=${photos[index].alt} /></a>`
      // photoEls[4].innerHTML = `<a href=""><img src=${photos[index+4].src.large} alt=${photos[index].alt} /></a>`
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', () => clickHandler(-1), false);
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => clickHandler(1), false);
    }
  
    if (prevBtn || nextBtn) {
      // console.log('prevBtn || nextBtn', sectionEl);
      window.addEventListener(
        'keydown',
        (e) => {
          // console.log("keydown: e.keyCode", e.keyCode);
          // console.log("keydown: e.code", e.code);
          if (
            e.code === 'ArrowUp' ||
            e.code === 'ArrowRight' ||
            e.code === 'ArrowDown' ||
            e.code === 'ArrowLeft'
          ) {
            // if (e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            // if (e.keyCode === 39 || e.keyCode === 40) {
            if (e.code === 'ArrowRight' || e.code === 'ArrowUp') {
              clickHandler(1);
              // if (e.ctrlKey){
              //   articleFocus = articles.length-1;
              // } else {
              //   articleFocus++
              //   if (articleFocus >= articles.length) {
              //     articleFocus = 0;
              //   }
  
              // }
              // } else if (e.keyCode === 37 || e.keyCode === 38) {
            } else if (e.code === 'ArrowLeft' || e.code === 'ArrowDown') {
              clickHandler(-1);
              // if (e.ctrlKey){
              //   articleFocus = 0;
              // } else {
              //   articleFocus--;
              //   if (articleFocus < 0) {
              //     articleFocus = articles.length-1;
              //   }
  
              // }
            }
          }
        },
        false
      );
    }
  }
  