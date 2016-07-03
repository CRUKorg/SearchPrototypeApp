(function () {
  'use strict';

  app.component('searchSummary', {
    scope: true,
    controller: 'SearchController',
    controllerAs: 'ctrl',
    bindToController: {
      results: '<',
      totalItems: '<'
    },
    templateUrl: 'summary/components/SummaryComponent.html'
  });

}());