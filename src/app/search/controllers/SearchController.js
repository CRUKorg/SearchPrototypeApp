(function () {
  'use strict';

  app.controller('SearchController', ['configurationService', 'ElasticService', 'esFactory', '$log', function(config, ElasticService, esFactory, $log) {
    var self = this;

    /**
     * Setup variables.
     */
    self.searchInput = null;
    self.lastSearch = null;
    self.page = 1;
    self.resultsPerPage = config.getSetting('resultsPerPage', 10);
    self.failedSearch = false;

    /**
     * Results vars.
     */
    self.error = null;
    self.results = null;

    /**
     * Form submit callback, execute a search.
     *
     * @param {string} searchInput The search query to run against Elastic.
     */
    self.searchSubmit = function(searchInput) {
      if (searchInput !== '' && searchInput != self.lastSearch) {
        self.lastSearch = searchInput;
        self.executeSearch(searchInput);
      }
    };

    /**
     * Execute a search against Elastic.
     *
     * @param {string} searchInput The query to run against Elastic.
     */
    self.executeSearch = function(searchInput) {
      /**
       * Search! First clear any errors.
       */
      self.error = null;

      ElasticService.search({
        index: 'elasticsearch_index_elasticproto_news',
        from: (self.page - 1) * self.resultsPerPage,
        size: self.resultsPerPage,
        body: {
          query: {
            multi_match: {
              type: 'phrase',
              fields: ['title', 'body:value'],
              query: searchInput
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
        self.error = null;
        self.page = 1;
        self.results = body.hits.hits;

        if (self.results.length < 1) {
          self.noResults();
        }
        else {
          self.failedSearch = false;
        }
      }, function (error) {
        self.error = error.message;
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
    };
  }]);

}());