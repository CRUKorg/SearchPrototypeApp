(function () {
  'use strict';

  app.component('searchResults', {
    controller: 'SearchController',
    bindings: {
      results: '<',
      totalItems: '<'
    },
    templateUrl: 'results/components/ResultsComponent.html'
  });

}());