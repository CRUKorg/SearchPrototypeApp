(function () {
  'use strict';

  /**
   * Define the ElasticSearch service as per...
   * https://github.com/elastic/bower-elasticsearch-js
   */
  app.service('ElasticService', function (esFactory) {
    return esFactory({
      host: crukSearch.config.host,
      apiVersion: '2.3',
      log: 'trace'
    });
  });

}());