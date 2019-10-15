'use strict';

(function () {

  var VISUALLY_HIDDEN_CLASS = 'visually-hidden';

  var picturesElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPicCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
  var loadCommentsBtnElement = bigPictureElement.querySelector('.comments-loader');
  var commentCountElement = bigPictureElement.querySelector('.social__comment-count');

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var mainElement = document.querySelector('main');
  var bodyElement = document.querySelector('body');

  var renderPhoto = function (photo) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__comments').textContent = photo.comments.message;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__img').alt = photo.description;

    photoElement.addEventListener('click', function () {
      renderBigPicture(photo);
    });

    photoElement.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, renderBigPicture(photo));
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

  var successHandler = function (photos) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    picturesElement.appendChild(fragment);

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
