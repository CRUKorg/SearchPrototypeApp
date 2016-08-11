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
    .config('http://edbe61a04bb14f8ba76d2437f55df69f@ec2-52-48-134-162.eu-west-1.compute.amazonaws.com:8080/2')
    .addPlugin(Raven.Plugins.Angular)
    .install();

}(this));