(function () {
  'use strict';

  /**
   * Provide a date filter which accepts the extra format character "S" which
   * will be replaced with an ordinal suffix.
   *
   * @return {string} A formatted date.
   */
  app.filter('dateos', ['$filter', function($filter) {
    var suffixes = ['th', 'st', 'nd', 'rd'];

    return function(string, format, timezone) {
      if (!angular.isString(string)) {
        return string;
      }

      format = format || 'mediumDate';
      timezone = timezone || null;

      /**
       * If the ordinal suffix character "S" isn't in the format string, just
       * use the date filter.
       */
      if (format.indexOf('S') === -1) {
        return $filter('date')(string, format, timezone);
      }

      var dtfilter = $filter('date')(string, format, timezone);
      var day = parseInt(dtfilter.slice(-2));
      var relevantDigits = (day < 30) ? day % 20 : day % 30;
      var suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];

      return $filter('date')(string, format, timezone).replace('S', suffix);
    };
  }]);

}());