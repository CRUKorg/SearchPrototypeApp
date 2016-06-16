(function () {
  'use strict';

  /**
   * Define the ElasticSearch service as per...
   * https://github.com/elastic/bower-elasticsearch-js
   */
  app.service('ElasticService', ['esFactory', 'configurationService',
    function (esFactory, config) {
      return esFactory({
        host: config.getSetting('host', ''),
        apiVersion: '2.3',
        log: config.getSetting('debug', false) ? 'trace' : 'error'
      });
  }]);

}());