'use strict';

(function () {
  var HIDDEN_CLASS = 'hidden';
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === ENTER_KEYCODE) {
      action();
    }
  };

  var hide = function (element) {
    element.classList.add(HIDDEN_CLASS);
  };

  var show = function (element) {
    element.classList.remove(HIDDEN_CLASS);
  };

  window.util = {
    isEscEvent: isEscEvent,
    isEnterEvent: isEnterEvent,
    hide: hide,
    show: show
  };
})();
