'use strict';

var HIDDEN_CLASS = 'hidden';
var ESC_KEYCODE = 27;
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

var uploadInputElement = document.querySelector('.img-upload__input');
var uploadFormElement = document.querySelector('.img-upload__overlay');
var buttonCloseElement = uploadFormElement.querySelector('.img-upload__cancel');
var pinElement = uploadFormElement.querySelector('.effect-level__pin');
var effectLineElement = uploadFormElement.querySelector('.effect-level__line');

var effectValueElement = uploadFormElement.querySelector('.effect-level__value');
var effectsElements = uploadFormElement.querySelectorAll('.effects__radio');
var imagePreview = uploadFormElement.querySelector('.img-upload__preview');
var previewOriginalElement = uploadFormElement.querySelector('#effect-none');
var sliderFormElement = uploadFormElement.querySelector('.effect-level');

var filters = {
  chrome: {
    name: 'grayscale',
    minValue: 0,
    maxValue: 1,
    unit: ''
  },
  sepia: {
    name: 'sepia',
    minValue: 0,
    maxValue: 1,
    unit: ''
  },
  marvin: {
    name: 'invert',
    minValue: 0,
    maxValue: 100,
    unit: '%'
  },
  phobos: {
    name: 'blur',
    minValue: 0,
    maxValue: 3,
    unit: 'px'
  },
  heat: {
    name: 'brightness',
    minValue: 1,
    maxValue: 3,
    unit: ''
  },
};

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
    comments.push({
      avatar: 'img/avatar-' + getRandomInRange(1, 6) + '.svg',
      message: getRandomElement(COMMENTS),
      name: getRandomElement(NAMES)
    });
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

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var closePopup = function () {
  uploadFormElement.classList.add(HIDDEN_CLASS);
  document.removeEventListener('keydown', onPopupEscPress);
  uploadInputElement.value = uploadInputElement.defaultValue;
};

var setValue = function (value) {
  pinElement.style.left = value + '%';
  effectValueElement.setAttribute('value', value);

  var effectName = uploadFormElement.querySelector('.effects__list input:checked').value;
  var currentFilter = filters[effectName];
  if (currentFilter) {
    var photoStyle = currentFilter.name + '('
    + ((currentFilter.maxValue - currentFilter.minValue) * effectValueElement.value + currentFilter.minValue) / 100
    + currentFilter.unit
    + ')';
    imagePreview.style.filter = photoStyle;
    sliderFormElement.classList.remove(HIDDEN_CLASS);
  } else {
    imagePreview.style.filter = 'none';
    sliderFormElement.classList.add(HIDDEN_CLASS);
  }
};

var onEffectClick = function () {
  for (var i = 1; i < effectsElements.length; i++) {
    effectsElements[i].addEventListener('click', function () {
      setValue(100);
    });
  }
};

init();

uploadInputElement.addEventListener('change', function () {
  uploadFormElement.classList.remove(HIDDEN_CLASS);
  document.addEventListener('keydown', onPopupEscPress);
  setValue(100);
});

buttonCloseElement.addEventListener('click', function () {
  closePopup();
});

effectLineElement.addEventListener('mouseup', function (event) {
  var bounds = effectLineElement.getBoundingClientRect();
  var value = (event.clientX - bounds.left) / bounds.width * 100;
  setValue(value);
});

onEffectClick();

previewOriginalElement.addEventListener('click', function () {
  imagePreview.style.filter = 'none';
  sliderFormElement.classList.add(HIDDEN_CLASS);
});

//  валидация хэш-тегов

var HASHTAG_COUNT = 5;
var hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');

var isTooManyHashtags = function (array) {
  if (array.length - 1 >= HASHTAG_COUNT) {
    return true;
  } else {
    return false;
  }
};

var hasRepeats = function (array) {
  for (var i = 0; i < array.length; i++) {
    for (var j = i + 1; j < array.length; j++) {
      if (array[i] === array[j]) {
        return true;
      }
    }
  }
  return false;
};

var validateHashtag = function (hashtags) {
  var hashtagStrings = hashtags.split(/\s+/g);
  if (isTooManyHashtags(hashtagStrings)) {
    return 'Слишком много хэштегов!';
  }

  if (hasRepeats(hashtagStrings)) {
    return 'Хэштеги повторяются';
  }

  for (var i = 0; i < hashtagStrings.length; i++) {
    if (!hashtagStrings[i].match(/^#[a-z]{1,19}$/i) && hashtagStrings[i] !== '') {
      return 'Неправильный формат хэштега';
    }
  }
  return '';
};

hashtagsInputElement.addEventListener('change', function () {
  var hashtags = hashtagsInputElement.value;
  hashtagsInputElement.setCustomValidity(validateHashtag(hashtags));
});

hashtagsInputElement.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.stopPropagation();
  }
});
