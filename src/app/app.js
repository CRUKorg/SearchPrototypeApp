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
    .config('https://897353ebedab448a9798b131b79f4244@app.getsentry.com/86680')
    .addPlugin(Raven.Plugins.Angular)
    .install();

}(this));