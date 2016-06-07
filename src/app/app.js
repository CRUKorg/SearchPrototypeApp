(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'ui.router',
    'ngSanitize',
    'elasticsearch',
    'ui.bootstrap',
    'angulartics',
    'angulartics.google.analytics'
  ]);

}(this));