(function () {
  'use strict';

  /**
   * Returns a string where [mark]'s are replaced with their HTML element
   * counterpart. Also remove any occurances of "/>" which seems to crop up.
   *
   * http://stackoverflow.com/questions/822452/strip-html-from-text-javascript
   *
   * @param {string} string
   *   The string to mark as safe.
   * @return {string} plain text string
   */
  app.filter('highlightmatches', function() {
    return function(string) {
      if (!angular.isString(string)) {
        return string;
      }
      return string.split('[mark]').join('<mark>').split('[/mark]').join('</mark>').split('/>').join('');
    };
  });

}());