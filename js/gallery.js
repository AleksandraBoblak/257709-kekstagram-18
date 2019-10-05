'use strict';

(function () {

  var VISUALLY_HIDDEN_CLASS = 'visually-hidden';

  var picturesElement = document.querySelector('.pictures');
  var pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

  var bigPictureElement = document.querySelector('.big-picture');
  var loadCommentsBtnElement = bigPictureElement.querySelector('.comments-loader');
  var commentCountElement = bigPictureElement.querySelector('.social__comment-count');

  var renderPhoto = function (photo) {
    var photoElement = pictureTemplate.cloneNode(true);

    photoElement.querySelector('.picture__comments').textContent = photo.comments.message;
    photoElement.querySelector('.picture__likes').textContent = photo.likes;
    photoElement.querySelector('.picture__img').src = photo.url;
    photoElement.querySelector('.picture__img').alt = photo.description;

    return photoElement;
  };

  var renderPhotosToDOM = function (photos) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < photos.length; i++) {
      fragment.appendChild(renderPhoto(photos[i]));
    }
    picturesElement.appendChild(fragment);
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

    loadCommentsBtnElement.classList.add(VISUALLY_HIDDEN_CLASS);
    commentCountElement.classList.add(VISUALLY_HIDDEN_CLASS);
  };

  var init = function () {
    var photosArray = window.data.generatePhotosArray();
    renderPhotosToDOM(photosArray);
    renderBigPicture(photosArray[0]);
    //  window.util.show(bigPictureElement);
  };

  init();

})();
