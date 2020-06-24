(function () {
  'use strict';

  var navEl = document.querySelector('.jsNav');
  var slide = document.querySelector('.jsSlide');
  var slideImg = document.querySelector('.jsSlide__img');
  var slideCreditLink = document.querySelector('.jsSlide__creditLink');
  var thumbnails = document.querySelectorAll('.jsThumbnail');

  /**
   * Create a "previous" button:
   *  <button type="button" title="Show previous" class="l-nav-wrapper__btn-prev o-btn o-btn--prev" data-nav="previous">
   *    <span data-nav="previous" aria-hidden="true">&lt;</span>
   *  </button>
   */

  function createPrevBtn() {
    var prevBtn = document.createElement('BUTTON');
    var spanEl = document.createElement('SPAN');
    var text = document.createTextNode('<');
    prevBtn.setAttribute('type', 'button');
    prevBtn.setAttribute('title', 'Show previous');
    prevBtn.setAttribute('data-nav', 'previous');
    prevBtn.classList.add('o-btn', 'o-btn--prev', 'l-nav-wrapper__btn-prev');
    spanEl.setAttribute('aria-hidden', 'true');
    spanEl.setAttribute('data-nav', 'previous');
    spanEl.appendChild(text);
    prevBtn.appendChild(spanEl);
    navEl.appendChild(prevBtn);
  }

  /**
   * Create a "next" button:
   *  <button type="button" title="Show next" class="l-nav-wrapper__btn-next o-btn o-btn--next" data-nav="next">
   *    <span data-nav="next" aria-hidden="true">&gt;</span>
   *  </button>
   */

  function createNextBtn() {
    var nextBtn = document.createElement('BUTTON');
    var spanEl = document.createElement('SPAN');
    var text = document.createTextNode('>');
    nextBtn.setAttribute('type', 'button');
    nextBtn.setAttribute('title', 'Show next');
    nextBtn.setAttribute('data-nav', 'next');
    nextBtn.classList.add('o-btn', 'o-btn--next', 'l-nav-wrapper__btn-next');
    spanEl.setAttribute('aria-hidden', 'true');
    spanEl.setAttribute('data-nav', 'next');
    spanEl.appendChild(text);
    nextBtn.appendChild(spanEl);
    navEl.appendChild(nextBtn);
  }

  function getNextIndex(currentIndex, list) {
    if (currentIndex < list.length - 1) {
      return currentIndex + 1;
    } else {
      return 0;
    }
  }

  function getPreviousIndex(currentIndex, list) {
    if (currentIndex > 0) {
      return currentIndex - 1;
    } else {
      return list.length - 1;
    }
  }

  function changeImg(oldImg, newImg) {
    // Change image source and alt text
    oldImg.src = newImg.src;
    oldImg.sizes = newImg.sizes;
    oldImg.srcset = newImg.srcset;
    oldImg.alt = newImg.alt;
  }

  function changeLink(oldLink, newLink) {
    oldLink.href = newLink.href;
    oldLink.innerHTML = newLink.innerHTML;
  }

  function select(tab) {
    // https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
    tab.setAttribute('aria-selected', true);
    tab.setAttribute('tabIndex', '0');
    tab.classList.add('is-selected');
  }

  function unselect(tab) {
    // https://www.w3.org/TR/wai-aria-practices-1.1/#tabpanel
    tab.setAttribute('aria-selected', false);
    tab.setAttribute('tabIndex', '-1');
    tab.classList.remove('is-selected');
  }

  function handleNavClick(e) {
    // Get the index number of the currently displayed slide
    var currentIndex = parseInt(slide.getAttribute('data-slide'));

    var newIndex;
    // Get the index of the thumbnail to display
    if (e.target.getAttribute('data-nav') === 'next') {
      newIndex = getNextIndex(currentIndex, thumbnails);
    } else if (e.target.getAttribute('data-nav') === 'previous') {
      newIndex = getPreviousIndex(currentIndex, thumbnails);
    }

    var newThumbnail = thumbnails[newIndex];
    var newSlideImg = newThumbnail.querySelector('.jsThumbnail__img');
    var newSlideCreditLink = newThumbnail.querySelector('.jsThumbnail__credit');
    var currentThumbnail = thumbnails[currentIndex];

    // Change slide index
    slide.setAttribute('data-slide', newIndex);
    // Change slide image
    changeImg(slideImg, newSlideImg);
    // Change slide caption
    changeLink(slideCreditLink, newSlideCreditLink);
    // Show current selection
    unselect(currentThumbnail);
    select(newThumbnail);
  }

  function handleThumbnailClick() {
    var newSlideImg = this.querySelector('.jsThumbnail__img');
    var newSlideCreditLink = this.querySelector('.jsThumbnail__credit');
    var newIndex = parseInt(this.getAttribute('data-slide'));
    slide.setAttribute('data-slide', newIndex);

    changeImg(slideImg, newSlideImg);
    changeLink(slideCreditLink, newSlideCreditLink);

    for (var i = 0; i < thumbnails.length; i++) {
      unselect(thumbnails[i]);
    }
    select(this);
    this.focus();
  }

  function handleKeyDown(e) {
    // var key = e.code;
    // fixme: test
    var key = e.key;
    var currentIndex;

    // fixme:
    console.log(e.code);
    console.log(e.key);

    switch (key) {
      case 'Enter':
      case 'Space':
        e.preventDefault();
        // Trigger click on this element
        this.click();
        break;
      case 'Right': // IE
      case 'ArrowRight': {
        e.preventDefault();
        currentIndex = parseInt(this.getAttribute('data-slide'));
        var nextIndex = getNextIndex(currentIndex, thumbnails);
        var nextThumb = thumbnails[nextIndex];
        nextThumb.focus();
        break;
      }
      case 'Left': // IE
      case 'ArrowLeft': {
        e.preventDefault();
        currentIndex = parseInt(this.getAttribute('data-slide'));
        var prevIndex = getPreviousIndex(currentIndex, thumbnails);
        var prevThumb = thumbnails[prevIndex];
        prevThumb.focus();
        break;
      }
      case 'Home': {
        e.preventDefault();
        var firstThumb = thumbnails[0];
        firstThumb.focus();
        break;
      }
      case 'End': {
        e.preventDefault();
        var lastIndex = thumbnails.length - 1;
        var lastThumb = thumbnails[lastIndex];
        lastThumb.focus();
        break;
      }
      default:
        return;
    }
  }

  window.onload = function () {
    createPrevBtn();
    createNextBtn();
  };

  navEl.addEventListener('click', handleNavClick, false);

  for (var i = 0; i < thumbnails.length; i++) {
    thumbnails[i].addEventListener('click', handleThumbnailClick, false);
    thumbnails[i].addEventListener('keydown', handleKeyDown);
  }
})();
