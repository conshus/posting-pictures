import {
    getPageContent,
    onLinkNavigate,
    transitionHelper,
    getLink,
    getHeadContent,
  } from './utils.js';
  import { galleryInit } from './gallery.js';
  import { detailsInit } from './details.js';
  console.log('scripts!');
  onLinkNavigate(async ({ fromPath, toPath }) => {
    const content = await getPageContent(toPath);
    let headContent = await getHeadContent(toPath);
    console.log('fromPath!', fromPath.replace('/', ''));
    console.log('toPath!', toPath);
    // console.log('onLinkNavigate!', content);
    // console.log('onLinkNavigate! head', headContent);
    console.log('typeof content!', typeof content);
    console.log('typeof headContent!', typeof headContent);
    let modifiedContent;
    let modifiedHeadContent = '';
  
    let classNames;
    let targetThumbnail;
    let prevPhotoIndex;
    let currentPhotoIndex;
  
    let photoData = sessionStorage.getItem('photos');
    // console.log('photoData: ', photoData);
    if (photoData) {
      let photos = JSON.parse(photoData);
      console.log('photos: ', photos);
      // find index of prev photo
      console.log("fromPath.replace('/', ''): ",fromPath.replace('/', ''));
      console.log("fromPath.split('/'): ",fromPath.split('/'));
      const fromPathSplit = fromPath.split('/');
      console.log("fromPathSplit last: ", fromPathSplit[fromPathSplit.length-1]);
    //   prevPhotoIndex = photos.findIndex(
    //     (photo) => photo.filename == fromPath.replace('/', '')
    //   );
      prevPhotoIndex = photos.findIndex(
        (photo) => photo.filename == fromPathSplit[fromPathSplit.length-1]
      );
      console.log("toPath.replace('/', ''): ",toPath.replace('/', ''));
      console.log("toPath.split('/'): ",toPath.split('/'));
      const toPathSplit = toPath.split('/');
      console.log("toPathSplit last: ", toPathSplit[toPathSplit.length-1]);
    //   currentPhotoIndex = photos.findIndex(
    //     (photo) => photo.filename == toPath.replace('/', '')
    //   );
      currentPhotoIndex = photos.findIndex(
        (photo) => photo.filename == toPathSplit[toPathSplit.length-1]
      );
      console.log('prevPhotoIndex: ', prevPhotoIndex);
      console.log('currentPhotoIndex: ', currentPhotoIndex);
      // classNames =
      //   currentPhotoIndex - prevPhotoIndex === -1
      //     ? 'prev-transition'
      //     : 'next-transition';
  
      if (prevPhotoIndex !== -1 && currentPhotoIndex === -1) {
        // either going from details page to gallery
        console.log('details to gallery');
        // switch around photos so that prevPhoto is at the beginning
        const newPhotosFront = photos.slice(prevPhotoIndex);
        const newPhotosEnd = photos.slice(0, prevPhotoIndex);
        const newPhotosOrder = [...newPhotosFront, ...newPhotosEnd];
        console.log('newPhotosOrder: ', newPhotosOrder);
        // const photosString = JSON.stringify(newPhotosOrder).replace(/'/g, "\\'");
        const photosString = JSON.stringify(newPhotosOrder).replaceAll(
          "'",
          '&#39;'
        );
        console.log('photosString: ', photosString);
  
        // replace the photos in section
        const sectionStartIndex = content.indexOf('<section id="photos-section"');
        console.log('sectionStartIndex: ', sectionStartIndex);
        const sectionEndIndex = content.indexOf('</section>');
        console.log('sectionEndIndex: ', sectionEndIndex);
        if (sectionStartIndex !== -1 && sectionEndIndex !== -1){
            const replaceText = `<section id="photos-section" data-photos='${photosString}'>${newPhotosOrder
                .map((photo, index) => {
                  if (index < 5) {
                    return `<div class="photo-container transition"><div class="photo"><a href='${photo.filename}'><img src='${photo.url}' alt='${photo.altText}' /></a></div></div>`;
                  }
                })
                .join('')}`;
              modifiedContent = content.replace(
                content.substring(sectionStartIndex, sectionEndIndex),
                replaceText
              );
              classNames = 'details-to-gallery-page';      
        } else {
            // navigating to a non picture page.
            console.log("navigating to a non picture page");
            classNames = '';
        }
      } else if (prevPhotoIndex === -1 && currentPhotoIndex !== -1) {
        // going from gallery page to details page
        console.log('gallery to details');
        classNames = 'gallery-to-details-page';
        targetThumbnail = getLink(toPath).querySelector('img');
        // console.log('targetThumbnail: ', targetThumbnail);
        targetThumbnail.style.viewTransitionName = 'full-img';
        const contentReplaceFullImg = content.replaceAll(
          'id="image-container" class=""',
          'id="image-container" class="full-img"'
        );
        modifiedContent = contentReplaceFullImg.replaceAll(
          '<img id="photo">',
          targetThumbnail.outerHTML
        );
        console.log('onLinkNavigate! after', modifiedContent);
      } else if (prevPhotoIndex !== -1 && currentPhotoIndex !== -1) {
        // going from details page to details page
        console.log('details to details');
        // add link preload to head
        // headContent += 'test';
        // headContent = '';
        // headContent.concat(
        //   ' ',
        //   '<link rel="preload" as="image" href="https://images.pexels.com/photos/624015/pexels-photo-624015.jpeg?auto=compress&cs=tinysrgb&h=650&w=940">'
        // );
        headContent += `<link rel="preload" as="image" href="${photos[currentPhotoIndex].url}">`;
        console.log('headConent2!!!!!: ', headContent);
        modifiedContent = content.replaceAll(
          '<img id="photo">',
          `<img alt="${photos[currentPhotoIndex].altText}" src="${photos[currentPhotoIndex].url}"/>`
        );
        console.log('details to details after', modifiedContent);
        const indexDiff = currentPhotoIndex - prevPhotoIndex;
        console.log('indexDiff: ', indexDiff);
        if (indexDiff === -1) {
          classNames = 'prev-transition';
        } else if (indexDiff === 1) {
          classNames = 'next-transition';
        } else {
          classNames = '';
        }
      } else {
        // either going to gallery or photo not found, either way go to the gallery
        console.log('just to gallery');
        classNames = '';
        // console.log('headConent2!!!!!: ', headContent);
      }
      console.log('classNames: ', classNames);
      // if (photoIndex !== -1) {
      //   generatePhotoDetail();
      // } else {
      //   console.log('not in array, need to make a fetch call');
      // }
    } else {
      console.log('need to make a fetch call');
    }
  
    const transition = transitionHelper({
      classNames,
      updateDOM() {
        // This is a pretty heavy-handed way to update page content.
        // In production, you'd likely be modifying DOM elements directly,
        // or using a framework.
        // innerHTML is used here just to keep the DOM update super simple.
        console.log('document.head: ', document.head);
        if (classNames === '') {
          document.body.innerHTML = content;
        } else {
          // if (headContent !== '') {
          //   console.log('headConent: ', headContent);
          document.head.innerHTML = headContent;
          // }
          document.body.innerHTML = modifiedContent;
        }
        if (classNames === 'details-to-gallery-page') {
          targetThumbnail = getLink(fromPath).querySelector('img');
          console.log('targetThumbnail: ', targetThumbnail);
          targetThumbnail.style.viewTransitionName = 'full-img';
        }
      },
    });
  
    transition.finished.finally(() => {
      // Clear the temporary tag
      // if (targetThumbnail) targetThumbnail.style.viewTransitionName = '';
      console.log('transition finished finally!');
      const entries = navigation.entries();
      // console.log('entries: ', entries);
  
      //////////
      if (
        classNames === 'prev-transition' ||
        classNames === 'next-transition' ||
        classNames === 'gallery-to-details-page'
      ) {
        detailsInit();
      }
      ///////////
      if (classNames === 'details-to-gallery-page') {
        galleryInit();
  
      }
      ///////////
    //   if (classNames === 'details-to-gallery-page' || classNames === '') {
    //     galleryInit();
  
    //   }
      //////////////
      // Clear the temporary tag
      if (targetThumbnail) {
        console.log('targetThumbnail: ', targetThumbnail);
        targetThumbnail.style.viewTransitionName = '';
        console.log('targetThumbnail: ', targetThumbnail);
      }
    });
  
  });
  
