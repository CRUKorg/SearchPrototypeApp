(function () {
  'use strict';

  app.component('searchInput', {
    scope: true,
    controller: 'SearchController',
    controllerAs: 'ctrl',
    bindToController: {
      search: {
        input: '='
      }
    },
    templateUrl: 'input/components/InputComponent.html'
  });

}());