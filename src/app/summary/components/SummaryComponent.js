(function () {
  'use strict';

  app.component('searchSummary', {
    controller: 'SearchController',
    bindings: {
      text: '<',
      totalItems: '<',
      failedSearch: '<',
    },
    templateUrl: 'summary/components/SummaryComponent.html',
  });

}());