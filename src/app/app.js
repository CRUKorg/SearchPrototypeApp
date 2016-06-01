(function (global) {
  'use strict';

  global.app = angular.module('searchPrototypeApp', [
    'ui.router',
    'elasticsearch',
    'angulartics',
    'angulartics.google.analytics'
  ]);

}(this));