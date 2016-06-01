/**
 * Created by fechit01 on 03/05/2016.
 */

(function () {
  'use strict';

  /**
   * Marks a string as HTML safe.
   * @param {string} message
   *   The string to mark as safe.
   * @return safeMessage
   */
  app.filter('htmlsafe', ['$sce', function($sce) {
    return function(message) {
      return $sce.trustAsHtml(message);
    };
  }]);

}());