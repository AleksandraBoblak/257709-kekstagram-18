'use strict';

(function () {
  var HASHTAG_COUNT = 5;
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

  var hashtagsInputElement = uploadFormElement.querySelector('.text__hashtags');
  var commentInputElement = uploadFormElement.querySelector('.text__description');

  var imgUploadFormElement = document.querySelector('.img-upload__form');
  var mainElement = document.querySelector('main');
  var successTemplate = document.querySelector('#success')
  .content
  .querySelector('.success');

  var errorTemplate = document.querySelector('#error')
  .content
  .querySelector('.error');

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  var closePopup = function () {
    window.util.hide(uploadFormElement);
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
      window.util.show(sliderFormElement);
    } else {
      imagePreview.style.filter = 'none';
      window.util.hide(sliderFormElement);
    }
  };

  var onEffectClick = function () {
    for (var i = 1; i < effectsElements.length; i++) {
      effectsElements[i].addEventListener('click', function () {
        setValue(100);
      });
    }
  };

  var isTooManyHashtags = function (array) {
    return array.length > HASHTAG_COUNT;
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

  var loadSuccessHandler = function () {
    closePopup();
    var successElement = successTemplate.cloneNode(true);
    mainElement.appendChild(successElement);

    var successBtnElement = successElement.querySelector('.success__button');

    var handleEscPress = function (evt) {
      window.util.isEscEvent(evt, removeSuccessMessage);
    };

    var removeSuccessMessage = function () {
      mainElement.removeChild(successElement);
      successBtnElement.removeEventListener('click', removeSuccessMessage);
      document.removeEventListener('keydown', handleEscPress);
      document.removeEventListener('click', removeSuccessMessage);
    };

    successBtnElement.addEventListener('click', removeSuccessMessage);

    document.addEventListener('keydown', handleEscPress);

    document.addEventListener('click', removeSuccessMessage);

    if (document.querySelector('.error')) {
      document.querySelector('.error').remove();
    }
  };

  var errorHandler = function (errorMessage) {
    closePopup();

    var errorElement = errorTemplate.cloneNode(true);
    errorElement.querySelector('.error__title').textContent = errorMessage;
    mainElement.appendChild(errorElement);

    var errorBtnElement = errorElement.querySelectorAll('.error__button');

    var handleEscPress = function (evt) {
      window.util.isEscEvent(evt, removeErrorMessage);
    };

    var removeErrorMessage = function () {
      mainElement.removeChild(errorElement);
      document.removeEventListener('keydown', handleEscPress);
      document.removeEventListener('click', removeErrorMessage);
    };

    var errorBtnHandler = function (button) {
      button.addEventListener('click', removeErrorMessage);
    };

    document.addEventListener('keydown', handleEscPress);

    document.addEventListener('click', removeErrorMessage);

    for (var i = 0; i < errorBtnElement.length; i++) {
      errorBtnHandler(errorBtnElement[i]);
    }
  };

  buttonCloseElement.addEventListener('click', function () {
    closePopup();
  });

  imgUploadFormElement.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(imgUploadFormElement), loadSuccessHandler, errorHandler);
    evt.preventDefault();
  });

  var markInvalid = function (element) {
    element.style.outline = '2px red solid';
  };

  onEffectClick();

  uploadInputElement.addEventListener('change', function () {
    window.util.show(uploadFormElement);

    document.addEventListener('keydown', onPopupEscPress);
    setValue(100);
  });

  effectLineElement.addEventListener('mouseup', function (event) {
    var bounds = effectLineElement.getBoundingClientRect();
    var value = (event.clientX - bounds.left) / bounds.width * 100;
    setValue(value);
  });

  previewOriginalElement.addEventListener('click', function () {
    imagePreview.style.filter = 'none';
    window.util.hide(sliderFormElement);
  });

  hashtagsInputElement.addEventListener('change', function () {
    var hashtags = hashtagsInputElement.value;
    hashtagsInputElement.setCustomValidity(validateHashtag(hashtags));
  });

  hashtagsInputElement.addEventListener('invalid', function () {
    markInvalid(hashtagsInputElement);
  });

  hashtagsInputElement.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
  });

  commentInputElement.addEventListener('keydown', function (evt) {
    window.util.isEscEvent(evt, function () {
      evt.stopPropagation();
    });
  });

  commentInputElement.addEventListener('invalid', function () {
    markInvalid(commentInputElement);
  });
})();
