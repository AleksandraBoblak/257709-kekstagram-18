'use strict';

(function () {
  var HIDDEN_CLASS = 'hidden';
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    hide: function (element) {
      element.classList.add(HIDDEN_CLASS);
    },
    show: function (element) {
      element.classList.remove(HIDDEN_CLASS);
    },
  };

})();
