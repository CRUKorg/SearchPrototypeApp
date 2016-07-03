(function () {
  'use strict';

  app.component('searchSummary', {
    scope: true,
    controller: 'SearchController',
    controllerAs: 'ctrl',
    bindToController: {
      search: {
        text: '<'
      },
      totalItems: '<'
    },
    templateUrl: 'summary/components/SummaryComponent.html'
  });

}());