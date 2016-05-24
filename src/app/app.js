(function () {
  'use strict';

  angular.module('searchPrototypeApp', ['ui.router', 'angulartics', 'angulartics.google.analytics'])
    .controller('SearchController', ['$location', function($location) {
      var self = this;

      /**
       * Setup variables.
       */
      self.search_input = null;
      self.last_search = null;

      self.message = 'quack';

      /**
       * Form submit callback, execute a search.
       */
      self.executeSearch = function(search_input) {
        if (search_input !== '' && search_input != self.last_search) {
          self.last_search = search_input;

          /**
           * Search!
           */

        }
      };
    }]);

}());