/**
 * Created by fechit01 on 03/05/2016.
 */

(function () {
  'use strict';

  /**
   * Marks a string as HTML safe.
   * @param {string} string
   *   The string to mark as safe.
   * @return safeString
   */
  app.filter('htmlsafe', ['$sce', function($sce) {
    return function(string) {
      return $sce.trustAsHtml(string);
    };
  }]);

}());