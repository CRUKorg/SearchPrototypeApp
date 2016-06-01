(function () {
  'use strict';

  /**
   * Returns a string without any whitespace on either end of it. To ensure
   * compatibility with older browsers regex is used rather than .trim().
   *
   * http://stackoverflow.com/questions/30506300/how-do-i-trim-a-string-in-angularjs
   *
   * @param {string} string
   *   The string to process.
   * @return {string}
   */
  app.filter('trim', function() {
    return function(string) {
      if (!angular.isString(string)) {
        return string;
      }
      return typeof String.prototype.trim !== 'function' ? string.trim() : string.replace(/^\s+|\s+$/g, '');
    };
  });

}());