export function detailsInit() {
    const photoId = document.querySelector('#photos-section').dataset.photoId;
    let photosString = document.querySelector('#photos-section').dataset.photos;
    const imageContainer = document.querySelector('#image-container img');
    const infoContainer = document.querySelector('#info');
    const previousContainer = document.querySelector('#prev-pic');
    const nextContainer = document.querySelector('#next-pic');
  
    let photoIndex;
    let photos;
    console.log('photoId: ', photoId);
    console.log('typeof photos: ',typeof  photos);
    if (photosString){
      console.log("details.js there are photos in section save to sessionStorage!")
      // there are photos in section save to sessionStorage
      sessionStorage.setItem('photos', photosString);
      photos = JSON.parse(photosString); 
    }
    let photoData = sessionStorage.getItem('photos');
    if (photoData) {
      photos = JSON.parse(photoData);
      console.log('photos: ', photos);
      // find index of photo
      photoIndex = photos.findIndex((photo) => photo.filename == photoId);
      console.log('photoIndex: ', photoIndex);
      if (photoIndex !== -1) {
        generatePhotoDetail();
      } else {
        //not in array, redirect to previous directory
        window.location.replace(
            "./"
          );
      }
    } else {
      console.log('need to make a fetch call');
    }
  
    function generatePhotoDetail() {
      imageContainer.src = `${photos[photoIndex].url}`;
      imageContainer.alt = `${photos[photoIndex].altText}`;
      infoContainer.innerHTML = `${photos[photoIndex].caption}<br/>${photos[photoIndex].title}<br/>${photos[photoIndex].locationName}`;
      console.log('infoContainer: ', infoContainer);
      previousContainer.innerHTML = `${
        photoIndex === 0
          ? ''
          : `<a rel="prefetch" href="${photos[photoIndex - 1].id}" class="navigation-link">&lArr;</a>`
      }`;
      nextContainer.innerHTML = `${
        photoIndex === photos.length - 1
          ? ''
          : `<a rel="prefetch" href="${photos[photoIndex + 1].id}" class="navigation-link">&rArr;</a>`
      }`;
    }
  }
  