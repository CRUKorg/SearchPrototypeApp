(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'ui.router',
    'elasticsearch',
    'ngSanitize',
    'angulartics',
    'angulartics.google.analytics'
  ]);

}(this));