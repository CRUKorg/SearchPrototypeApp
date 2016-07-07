(function () {
  'use strict';

  app.component('searchResults', {
    controller: 'SearchController',
    bindings: {
      results: '<',
      totalItems: '<',
      loading: '<',
      page: '<'
    },
    templateUrl: 'results/components/ResultsComponent.html'
  });

}());