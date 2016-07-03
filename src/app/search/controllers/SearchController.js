(function () {
  'use strict';

  app.controller('SearchController', ['configurationService', 'ElasticService', 'esFactory', '$sanitize', '$state', '$stateParams', '$document', '$log',
    function(config, ElasticService, esFactory, $sanitize, $state, $stateParams, $document, $log) {
      var self = this;

      /**
       * Setup variables.
       */
      self.search = {
        text: decodeURI($stateParams.query) || '',
        input: decodeURI($stateParams.query) || '',
        page: parseInt($stateParams.page) || 1
      };

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
          self.search.page = 1;

          self.executeSearch(self.search.input, true);
          self.updateState(self.search.text, self.search.page);
        }
      };

      /**
       * Execute a search against Elastic.
       *
       * @param {string} text The query to run against Elastic.
       */
      self.executeSearch = function(text) {

            var new_results = [];
            var i = 0;
            for (i = 0; i < self.resultsPerPage; i++) {
              var i2 = (self.search.page * self.resultsPerPage) + i - 9;
              var snippet = '';
              var item = {
                'fields': {
                  'title': ['Result #' + i2],
                  'field_url:url': ['http://www.cruk.org'],
                  'field_type': ['News'],
                  'field_published': [1467409896],
                },
                'highlight': {
                  'body:value': ['Blah blah blah blah blah blah blah blah']
                }
              };
              new_results.push(item);
            }
            self.results = new_results;
            self.totalItems = 2311;

            self.failedSearch = false;
            self.updateState(self.search.text, self.search.page);

        /*ElasticService.search({
          index: config.getSetting('index', ''),
          from: (self.search.page - 1) * self.resultsPerPage,
          size: self.resultsPerPage,
          body: {
            query: {
              multi_match: {
                type: 'phrase',
                fields: ['title', 'body:value'],
                query: text,
                analyzer: 'news'
                //fuzziness: 'AUTO'
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
          //self.search.page = 1;
          self.results = body.hits.hits;
          self.totalItems = body.hits.total;

          if (self.totalItems < 1) {
            self.noResults();
          }
          else {
            self.failedSearch = false;
          }

          // Update the page state.
          self.updateState(self.search.text, self.search.page);
        }, function (error) {
          $log.log('Ruh roh, sometihng went wrong when talking to Elastic... ' + $sanitize(error.message));
        });*/
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

      /**
       * Set the page of results to view.
       */
      self.setPage = function() {
        self.executeSearch(self.search.text);
        $document.scrollTopAnimated(0);
        //self.updateState(self.search.text, self.search.page);
      };

      /**
       * Update state.
       */
      self.updateState = function(text, page) {
        var decoded_query = decodeURI(self.search.text);

        if (decoded_query !== text || $stateParams.page !== page) {
          $state.go('.', {query: encodeURI(text), page: self.search.page}, {notify: true});
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