(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'templateCache',
    'ui.router',
    'ngSanitize',
    'elasticsearch',
    'ui.bootstrap',
    'duScroll',
    'angulartics',
    'angulartics.google.analytics'
  ]);

  /**
   * Define our routes.
   */
  global.app.config(function($stateProvider, $urlRouterProvider, $analyticsProvider) {
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

    /**
     * Disable automatic analytics page views, we'll do this manually.
     */
    $analyticsProvider.virtualPageviews(false);
  });

}(this));