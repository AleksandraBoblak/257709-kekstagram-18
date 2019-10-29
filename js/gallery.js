'use strict';

(function () {

  var VISUALLY_HIDDEN_CLASS = 'visually-hidden';
  var PHOTO_COUNT = 10;

  var picturesElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPicCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
  var loadCommentsBtnElement = bigPictureElement.querySelector('.comments-loader');
  var commentCountElement = bigPictureElement.querySelector('.social__comment-count');
  var imgFiltersElement = document.querySelector('.img-filters');
  var popularFilterElement = document.querySelector('#filter-popular');
  var randomFilterElement = document.querySelector('#filter-random');
  var discussedFilterElement = document.querySelector('#filter-discussed');

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var mainElement = document.querySelector('main');
  var bodyElement = document.querySelector('body');

  var renderPhoto = function (photo) {
    var photoElement = pictureTemplate.cloneNode(true);
    var img = photoElement.querySelector('.picture__img');

    photoElement.querySelector('.picture__comments').textContent = photo.comments.message;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    img.src = photo.url;
    img.alt = photo.description;

    photoElement.addEventListener('click', function () {
      renderBigPicture(photo);
    });

    return photoElement;
  };

  var renderBigPicture = function (photo) {
    bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
    bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
    bigPictureElement.querySelector('.social__caption').alt = photo.description;
    bigPictureElement.querySelector('.comments-count').textContent = photo.comments.length;

    var commentElements = bigPictureElement.querySelectorAll('.social__comment');
    for (var i = 0; i < commentElements.length; i++) {
      if (photo.comments[i]) {
        commentElements[i].querySelector('.social__picture').src = photo.comments[i].avatar;
        commentElements[i].querySelector('.social__picture').alt = photo.comments[i].name;
        commentElements[i].querySelector('.social__text').textContent = photo.comments[i].message;
      }
    }

    window.util.show(bigPictureElement);
    document.addEventListener('keydown', onPopupEscPress);

    loadCommentsBtnElement.classList.add(VISUALLY_HIDDEN_CLASS);
    commentCountElement.classList.add(VISUALLY_HIDDEN_CLASS);

    bodyElement.classList.add('modal-open');
  };

  var renderPhotosArray = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    Array.from(picturesElement.querySelectorAll('.picture')).forEach(function (picture) {
      picturesElement.removeChild(picture);
    });

    picturesElement.appendChild(fragment);
  };

  var setActiveButton = function (button) {
    randomFilterElement.classList.remove('img-filters__button--active');
    discussedFilterElement.classList.remove('img-filters__button--active');
    popularFilterElement.classList.remove('img-filters__button--active');
    button.classList.add('img-filters__button--active');
  };

  var renderSubset = window.debounce(function (selector, array) {
    renderPhotosArray(selector(array));
  });


  var selectRandomPhotos = function (photosArr) {
    var array = [];
    var getRandomPhoto = function () {
      var randomIndex = Math.floor(Math.random() * Math.floor(photosArr.length));
      return photosArr[randomIndex];
    };
    while (array.length < PHOTO_COUNT) {
      var randomPhoto = getRandomPhoto(photosArr);
      if (!array.includes(randomPhoto)) {
        array.push(randomPhoto);
      }
    }
    return array;
  };

  var listenRandomBtnClick = function (photosArr) {
    randomFilterElement.addEventListener('click', function () {
      setActiveButton(randomFilterElement);
      renderSubset(selectRandomPhotos, photosArr);
    });
  };

  var selectDiscussedPhotos = function (photosArr) {
    return photosArr.slice()
      .sort(function (a, b) {
        return a.comments.length - b.comments.length;
      });
  };

  var listenDiscussedBtnClick = function (photosArr) {
    discussedFilterElement.addEventListener('click', function () {
      setActiveButton(discussedFilterElement);
      renderSubset(selectDiscussedPhotos, photosArr);
    });
  };

  var selectPopularPhotos = function (photosArr) {
    return photosArr;
  };

  var listenPopularBtnClick = function (photosArr) {
    popularFilterElement.addEventListener('click', function () {
      setActiveButton(popularFilterElement);
      renderSubset(selectPopularPhotos, photosArr);
    });
  };

  var successHandler = function (photos) {

    imgFiltersElement.classList.remove('img-filters--inactive');

    renderPhotosArray(photos);
    listenRandomBtnClick(photos);
    listenDiscussedBtnClick(photos);
    listenPopularBtnClick(photos);

    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };

  var errorHandler = function (errorMessage) {
    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__title').textContent = errorMessage;
    mainElement.appendChild(errorElement);
  };

  var init = function () {
    window.backend.load(successHandler, errorHandler);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePreview);
  };

  var closePreview = function () {
    window.util.hide(bigPictureElement);
    document.removeEventListener('keydown', onPopupEscPress);
    bodyElement.classList.remove('modal-open');
  };

  bigPicCancelElement.addEventListener('click', function () {
    closePreview();
  });

  init();
})();
