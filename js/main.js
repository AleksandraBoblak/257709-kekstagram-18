'use strict';

var COMMENTS = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var NAMES = ['Артем', 'Ираклий', 'Марина', 'Снежана', 'Владлена', 'Апатий', 'Педро', 'Зидана'];
var PHOTOS_COUNT = 25;

var picturesElement = document.querySelector('.pictures');
var pictureTemplate = document.querySelector('#picture')
.content
.querySelector('.picture');

var getCommentsCount = function () {
  return getRandomInRange(0, 5);
};

var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

var getRandomInRange = function (min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

var generatePhotoDesc = function (index) {
  return {
    url: 'photos/' + (index + 1) + '.jpg',
    description: 'Случайная фотография',
    likes: getRandomInRange(15, 200),
    comments: generateCommentsArray()
  };
};

var generateCommentsArray = function () {
  var comments = [];
  var commentsCount = getCommentsCount();
  for (var i = 0; i < commentsCount; i++) {
    comments.push(
        {
          avatar: 'img/avatar-' + getRandomInRange(1, 6) + '.svg',
          message: getRandomElement(COMMENTS),
          name: getRandomElement(NAMES)
        }
    );
  }

  return comments;
};

var generatePhotosArray = function () {
  var photos = [];
  for (var i = 0; i < PHOTOS_COUNT; i++) {
    photos.push(generatePhotoDesc(i));
  }

  return photos;
};

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

var init = function () {
  renderPhotosToDOM(generatePhotosArray());
};

init();
