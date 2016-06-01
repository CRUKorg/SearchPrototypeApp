(function () {
  'use strict';

  /**
   * Returns a string which has any HTML tags removed.
   *
   * http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
   *
   * @param {string} string
   *   The string to mark as safe.
   * @return {string} plain text string
   */
  app.filter('plaintext', function() {
    return function(string) {
      if (!angular.isString(string)) {
        return string;
      }
      return string.replace(/<(?:.|\n)*?>/gm, '');
    };
  });

}());