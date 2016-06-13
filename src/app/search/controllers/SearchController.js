(function () {
  'use strict';

  app.controller('SearchController', ['configurationService', 'ElasticService', 'esFactory', '$sanitize', '$state', '$stateParams', '$location', '$document', '$log',
    function(config, ElasticService, esFactory, $sanitize, $state, $stateParams, $location, $document, $log) {
      var self = this;

      /**
       * Setup variables.
       */
      self.search = {
        text: decodeURI($stateParams.query) || '',
        input: decodeURI($stateParams.query) || '',
        page: $stateParams.page && parseInt($stateParams.page) || 1,
      };
      self.alerts = [];

      /**
       * Results vars.
       */
      self.results = [];
      self.totalItems = 0;
      self.resultsPerPage = config.getSetting('resultsPerPage', 10);
      self.failedSearch = false;

      /**
       * If last search is set and not blank then we should kick off a search,
       * this is done at the end of the file so that the "executeSearch" method
       * is defined.
       */

      /**
       * Form submit callback, execute a search.
       *
       * @param {string} search.input The search query to run against Elastic.
       */
      self.searchSubmit = function() {
        if (self.search.input !== '' && self.search.input != self.search.text) {
          self.search.text = self.search.input;
          self.executeSearch(self.search.input, true);
        }
      };

      /**
       * Execute a search against Elastic.
       *
       * @param {string} text The query to run against Elastic.
       */
      self.executeSearch = function(text, newSearch) {
        /**
         * Search! First clear any errors.
         */
        self.alertsClear();
        newSearch = newSearch || false;

        if (newSearch && self.search.page !== 1) {
          self.search.page = 1;
        }

        ElasticService.search({
          index: 'elasticsearch_index_elasticproto_news',
          from: (self.search.page - 1) * self.resultsPerPage,
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
          self.alertsClear();
          /*self.search.page = 1;*/
          self.results = body.hits.hits;
          self.totalItems = body.hits.total;

          if (self.totalItems < 1) {
            self.noResults();
          }
          else {
            self.failedSearch = false;
            self.alertsAdd('Your search for <strong>&quot;' + self.search.input + '&quot;</strong> found <strong>' + self.totalItems + '</strong> results in <strong>' + body.took + '</strong> milliseconds!', 'success');
          }

          // Update the page state.
          self.updateState(self.search.text, self.search.page);
        }, function (error) {
          self.alertsAdd($sanitize(error.message), 'danger');
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
        self.alertsAdd('Your search for <strong>&quot;' + self.search.input + '&quot;</strong> returned no results', 'warning');
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

      /**
       * Set the page of results to view.
       */
      self.setPage = function() {
        self.executeSearch(self.search.text);
        $document.scrollTopAnimated(0);
        self.updateState(self.search.text, self.search.page);
      };

      /**
       * Update state.
       */
      self.updateState = function(text, page) {
        if ($stateParams.query !== text && $stateParams.page !== page) {
          $state.go('search', {query: encodeURI(self.search.text), page: self.search.page}, {notify: false});
        }
      };

      /**
       * Execute a search if the default state says so.
       */
      if (self.search.text !== '') {
        self.executeSearch(self.search.text);
      }
    }]);

}());