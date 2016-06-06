(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'ui.router',
    'ngSanitize',
    'elasticsearch',
    'angulartics',
    'angulartics.google.analytics'
  ]);

}(this));