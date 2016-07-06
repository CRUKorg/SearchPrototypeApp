(function () {
  'use strict';

  app.controller('SearchController', ['$scope', 'configurationService', 'ElasticService', 'esFactory', '$sanitize', '$state', '$stateParams', '$document', '$log', '$analytics',
    function($scope, config, ElasticService, esFactory, $sanitize, $state, $stateParams, $document, $log, $analytics) {
      var self = this;

      /**
       * Setup variables.
       */
      self.search = {
        text: decodeURI($stateParams.query) || '',
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
       * Execute a search against Elastic.
       *
       * @param {string} text The query to run against Elastic.
       */
      self.executeSearch = function(text) {
console.log('do a search for ' + text, self.search);
            /*var new_results = [];
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
            self.updateState(self.search.text, self.search.page);*/

        ElasticService.search({
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
              fragment_size: 80,
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
console.log(self.results);
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
        $analytics.eventTrack('searchNoResults', {category: 'News prototype search', label: 'No results'});
      };

      /**
       * Set the page of results to view.
       */
      self.setPage = function() {
        /**
         * Track page change event.
         */
        $analytics.eventTrack('searchPaged', {category: 'News prototype search ', label: 'Search paged'});

        /**
         * Execute the search of the next page.
         */
        self.executeSearch(self.search.text);
      };

      /**
       * Update state.
       */
      self.updateState = function(text, page) {
        var decoded_query = decodeURI(self.search.text);
        var encoded_query = encodeURI(text);

        if ($stateParams.query !== encoded_query || $stateParams.page !== page) {
          /**
           * Push events to analytics (GA).
           */
          if ($stateParams.query !== encoded_query) {
            $analytics.pageTrack('/search?query=' + encoded_query);
            $analytics.eventTrack('search', {category: 'News prototype search ', label: 'Search'});
          }

          /**
           * Scroll to the top of the page.
           */
          if ($stateParams.page !== page) {
            $document.scrollTopAnimated(0);
          }

          /**
           * Update the application state/URL.
           */
          //$state.go('.', {query: encoded_query, page: self.search.page}, {notify: true});
        }
      };

      /**
       * Execute a search if the default state says so.
       */
      if (self.search.text !== '') {
        //self.executeSearch(self.search.text);
      }

      $scope.$on('searchSubmitted', function(event, data){
        self.search.text = data.query;
        self.search.page = 1;

        self.executeSearch(self.search.text);
      });
    }]);

}());