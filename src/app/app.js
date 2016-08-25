(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'templateCache',
    'ui.router',
    'ngSanitize',
    'elasticsearch',
    'ui.bootstrap',
    'duScroll'
  ]);

  /**
   * Define our routes.
   */
  global.app.config(function($stateProvider, $urlRouterProvider) {
    /**
     * Set the apps pages.
     */
    $urlRouterProvider.otherwise('search');

    $stateProvider.state('search', {
      url: '/search?query&page',
      controller: 'SearchController',
      controllerAs: 'ctrl',
      params: {
        query: {
          value: '',
          squash: true
        },
        page: {
          value: '1',
          squash: true
        }
      },
      templateUrl: 'search/controllers/search.html'
    });
  });

  Raven
    .config('https://58f9fc4e7bf844fbbfcdad8916fdc24d@sentrylog.cancerresearchuk.org/5')
    .addPlugin(Raven.Plugins.Angular)
    .install();

}(this));