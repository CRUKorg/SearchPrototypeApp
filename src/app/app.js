(function () {
  'use strict';

  angular.module('searchPrototypeApp', ['ui.router', 'elasticui', 'angulartics', 'angulartics.google.analytics'])
    .constant('euiHost', 'http://searchproto1.cancerresearchuk.org/elasticsearch');

}());