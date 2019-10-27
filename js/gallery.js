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

  var renderPhoto = function (photo, onLoad) {
    var photoElement = pictureTemplate.cloneNode(true);
    var img = photoElement.querySelector('.picture__img');

    photoElement.querySelector('.picture__comments').textContent = photo.comments.message;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    if (onLoad) {
      img.addEventListener('load', onLoad);
    }
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

  var renderPhotosArray = function (photos, loadHandler) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i], loadHandler));
    }
    Array.from(picturesElement.querySelectorAll('.picture')).forEach(function (picture) {
      picturesElement.removeChild(picture);
    });

    picturesElement.appendChild(fragment);
  };

  var listenRandomBtnClick = function (photosArr) {
    randomFilterElement.addEventListener('click', window.debounce(function () {
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
      renderPhotosArray(array);
    }));
  };

  var listenDiscussedBtnClick = function (photosArr) {
    discussedFilterElement.addEventListener('click', window.debounce(function () {
      var newArray = photosArr.slice()
        .sort(function (a, b) {
          return a.comments.length - b.comments.length;
        });
      renderPhotosArray(newArray);
    }));
  };

  var listenPopularBtnClick = function (photosArr) {
    popularFilterElement.addEventListener('click', window.debounce(function () {
      renderPhotosArray(photosArr);
    }));
  };

  var successHandler = function (photos) {
    var loadCount = 0;
    var loadHandler = function () {
      loadCount += 1;
      if (loadCount === photos.length) {
        imgFiltersElement.classList.remove('img-filters--inactive');
      }
    };

    renderPhotosArray(photos, loadHandler);
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
