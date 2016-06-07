(function () {
  'use strict';

  app.controller('SearchController', ['configurationService', 'ElasticService', 'esFactory', '$log', function(config, ElasticService, esFactory, $log) {
    var self = this;

    /**
     * Setup variables.
     */
    self.searchInput = '';
    self.lastSearch = null;
    self.page = 1;
    self.resultsPerPage = config.getSetting('resultsPerPage', 10);
    self.failedSearch = false;

    /**
     * Results vars.
     */
    self.results = null;

    /**
     * Form submit callback, execute a search.
     *
     * @param {string} searchInput The search query to run against Elastic.
     */
    self.searchSubmit = function() {
      if (self.searchInput !== '' && self.searchInput != self.lastSearch) {
        self.lastSearch = self.searchInput;
        self.executeSearch(self.searchInput);
      }
    };

    /**
     * Execute a search against Elastic.
     *
     * @param {string} text The query to run against Elastic.
     */
    self.executeSearch = function(text) {
      /**
       * Search! First clear any errors.
       */
      self.alertsClear();

      ElasticService.search({
        index: 'elasticsearch_index_elasticproto_news',
        from: (self.page - 1) * self.resultsPerPage,
        size: self.resultsPerPage,
        body: {
          query: {
            multi_match: {
              type: 'phrase',
              fields: ['title', 'body:value'],
              query: text
            }
          },
          fields: ['title', 'field_published', 'field_type', 'body:value', 'field_url:url'],
          highlight: {
            pre_tags: ['[mark]'],
            post_tags: ['[/mark]'],
            //encoder: 'html',
            fragment_size: 150,
            number_of_fragments: 3,
            fields: {
              title: {},
              'body:value': {}
            }
          }
        }
      }).then(function (body) {
        $log.log(body);
        self.alertsClear();
        self.page = 1;
        self.results = body.hits.hits;

        if (self.results.length < 1) {
          self.noResults();
        }
        else {
          self.failedSearch = false;
          self.alertsAdd('Your search for ' + self.searchInput + ' found ' + body.hits.total + ' results in ' + body.took + ' milliseconds!', 'success');
        }
      }, function (error) {
        self.alertsAdd(error.message, 'danger');
        $log.log(error.message);
      });
    };

    /**
     * Build an excerpt string for a search result.
     *
     * @param {object} fieldData An object containing field data from a search result.
     * @param {object} highlightData An object containing highlight data from a search result.
     * @return {string} An excerpt constructed of highlight data if available.
     */
    self.buildExcerpt = function(fieldData, highlightData) {

    };

    /**
     * Output a message stating no results have been found. At this point
     * trigger any specific GA reporting.
     */
    self.noResults = function() {
      self.failedSearch = true;
      self.alertsAdd('Your search for ' + self.searchInput + ' returned no results', 'warning');
    };

    /**
     * Add an alert to the output area.
     */
    self.alertsAdd = function(message, type) {
      type = type || 'info';

      self.alerts.push({
        msg: message,
        type: type
      });
    };

    /**
     * Dismiss all alerts.
     */
    self.alertsClear = function() {
      self.alerts = [];
    };
  }]);

}());