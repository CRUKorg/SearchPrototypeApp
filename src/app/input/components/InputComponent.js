(function () {
  'use strict';

  app.component('searchInput', {
    bindings: {},
    templateUrl: 'input/components/InputComponent.html',
    controller: ['$scope', '$stateParams', function($scope, $stateParams) {
      var self = this;
      self.search = {
        query: $stateParams.query,
        previousQuery: null
      };

      self.searchSubmit = function() {
        if (self.search.query !== '' && self.search.query !== self.search.previousQuery) {
          self.search.previousQuery = self.search.query;
          $scope.$emit('searchSubmitted', self.search);
        }
      };

      self.$onInit = function() {
        self.searchSubmit();
      };
    }]
  });

}());