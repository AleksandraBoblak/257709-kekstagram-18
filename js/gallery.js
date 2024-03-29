'use strict';

(function () {

  var HIDDEN_CLASS = 'hidden';
  var PHOTO_COUNT = 10;
  var SLICE_SIZE = 5;

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
  var commentsListElement = document.querySelector('.social__comments');

  var renderListItem = function (comment) {
    var liElement = document.createElement('li');
    var imgElement = document.createElement('img');
    var pElement = document.createElement('p');

    liElement.appendChild(imgElement);
    liElement.appendChild(pElement);

    liElement.classList.add('social__comment');
    imgElement.classList.add('social__picture');
    pElement.classList.add('social__text');

    imgElement.src = comment.avatar;
    imgElement.alt = comment.name;
    pElement.textContent = comment.message;

    commentsListElement.appendChild(liElement);
  };

  var removeListItem = function () {
    while (commentsListElement.firstChild) {
      commentsListElement.removeChild(commentsListElement.childNodes[0]);
    }
  };

  loadCommentsBtnElement.classList.add(HIDDEN_CLASS);

  var renderBigPicture = function (photo) {
    removeListItem();
    var comments = photo.comments;
    var arraySliceCount = Math.ceil(comments.length / SLICE_SIZE);
    var i = 0;

    if (arraySliceCount > 1) {
      loadCommentsBtnElement.classList.remove(HIDDEN_CLASS);
    }

    var renderNewComments = function () {
      var commentsSlice = comments.slice(i * SLICE_SIZE, (i + 1) * SLICE_SIZE);
      commentCountElement.firstChild.textContent = i * SLICE_SIZE + commentsSlice.length + ' из ';
      i++;
      for (var j = 0; j < commentsSlice.length; j++) {
        renderListItem(commentsSlice[j]);
      }

      if (i === arraySliceCount) {
        loadCommentsBtnElement.classList.add(HIDDEN_CLASS);
      }
    };

    renderNewComments();

    bigPictureElement.querySelector('.big-picture__img img').src = photo.url;
    bigPictureElement.querySelector('.likes-count').textContent = photo.likes;
    bigPictureElement.querySelector('.social__caption').alt = photo.description;
    bigPictureElement.querySelector('.comments-count').textContent = comments.length;

    var onLoadBtnClick = function () {
      renderNewComments(comments);
    };

    var onPopupEscPress = function (evt) {
      window.util.isEscEvent(evt, closePreview);
    };

    loadCommentsBtnElement.addEventListener('click', onLoadBtnClick);

    window.util.show(bigPictureElement);
    document.addEventListener('keydown', onPopupEscPress);

    bodyElement.classList.add('modal-open');

    var closePreview = function () {
      window.util.hide(bigPictureElement);
      document.removeEventListener('keydown', onPopupEscPress);
      bigPicCancelElement.removeEventListener('click', closePreview);
      loadCommentsBtnElement.removeEventListener('click', onLoadBtnClick);
      bodyElement.classList.remove('modal-open');
    };

    bigPicCancelElement.addEventListener('click', closePreview);
  };

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

  var listenRandomBtnClick = function (photos) {
    randomFilterElement.addEventListener('click', function () {
      setActiveButton(randomFilterElement);
      renderSubset(selectRandomPhotos, photos);
    });
  };

  var selectDiscussedPhotos = function (photos) {
    return photos.slice()
    .sort(function (photo1, photo2) {
      return photo1.comments.length - photo2.comments.length;
    });
  };

  var listenDiscussedBtnClick = function (photos) {
    discussedFilterElement.addEventListener('click', function () {
      setActiveButton(discussedFilterElement);
      renderSubset(selectDiscussedPhotos, photos);
    });
  };

  var selectPopularPhotos = function (photos) {
    return photos;
  };

  var listenPopularBtnClick = function (photos) {
    popularFilterElement.addEventListener('click', function () {
      setActiveButton(popularFilterElement);
      renderSubset(selectPopularPhotos, photos);
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

  init();
})();
