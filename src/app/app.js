(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'ui.router',
    'ngSanitize',
    'elasticsearch',
    'ui.bootstrap',
    'duScroll',
    'angulartics',
    'angulartics.google.analytics'
  ]);

}(this));