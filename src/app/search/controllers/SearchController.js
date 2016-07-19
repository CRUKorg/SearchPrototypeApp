(function () {
  'use strict';

  app.controller('SearchController', ['$scope', 'configurationService', 'ElasticService', 'esFactory', '$sanitize', '$state', '$stateParams', '$document', '$log', 'GTMTracking',
    function($scope, config, ElasticService, esFactory, $sanitize, $state, $stateParams, $document, $log, gtmTracking) {
      var self = this;

      /**
       * Setup variables.
       */
      self.search = {
        text: $stateParams.query || '',
        page: parseInt($stateParams.page) || 1
      };

      /**
       * Results vars.
       */
      self.results = [];
      self.totalItems = 0;
      self.resultsPerPage = config.getSetting('resultsPerPage', 10);
      self.failedSearch = false;
      self.loading = false;

      /**
       * Execute a search against Elastic.
       *
       * @param {string} text The query to run against Elastic.
       */
      self.executeSearch = function(text) {
        if (text.trim() === '') {
          return;
        }

        if (config.getSetting('debug', false)) {
          $log.log('Do a search for ' + text, self.search);
        }

        self.loading = true;

        ElasticService.search({
          index: config.getSetting('index', ''),
          from: (self.search.page - 1) * self.resultsPerPage,
          size: self.resultsPerPage,
          body: {
            query: {
              multi_match: {
                type: 'phrase',
                fields: ['title^1.5', 'body:value'],
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
              number_of_fragments: 3,
              fragment_size: 80,
              fields: {
                'body:value': {}
              }
            }
          }
        }).then(function (body) {
          self.results = body.hits.hits;
          self.totalItems = body.hits.total;
          self.loading = false;

          /**
           * Log things if in debug mode.
           */
          if (config.getSetting('debug', false)) {
            $log.log('The search request found ' + self.totalItems + 'results...', self.results);
          }

          /**
           * Trigger reactions to results.
           */
          if (self.totalItems < 1) {
            self.noResults();
          }
          else {
            /**
             * Scroll to the top of the page.
             */
            $document.scrollTopAnimated(0);

            /**
             * Note that the search was successful.
             */
            self.failedSearch = false;
          }

          /**
           * Send any queued GTM events.
           */
           gtmTracking.sendEvents(self.search.text, self.search.page, self.totalItems);

          /**
           * Update the page state.
           */
          self.updateState(self.search.text, self.search.page);
        }, function (error) {
          $log.log('Ruh roh, something went wrong when talking to Elastic... "' + $sanitize(error.message) + '".');
        });
      };

      /**
       * Output a message stating no results have been found. GTM/GA tracking
       * is taken care of within the GTM provider.
       */
      self.noResults = function() {
        self.failedSearch = true;

        if (config.getSetting('debug', false)) {
          console.log('track no results');
        }
      };

      /**
       * Set the page of results to view.
       */
      self.setPage = function() {
        /**
         * Track page change event.
         */
        gtmTracking.trackEvent('searchPaged');

        if (config.getSetting('debug', false)) {
          console.log('track page change');
        }

        /**
         * Execute the search of the next page.
         */
        self.executeSearch(self.search.text);
      };

      /**
       * Update state.
       */
      self.updateState = function(text, page) {
        if ($stateParams.query !== text || $stateParams.page !== page) {
          /**
           * Update the application state/URL.
           */
          $state.go('.', {query: text, page: self.search.page}, {notify: false});
        }
      };

      $scope.$on('searchSubmitted', function(event, data) {
        self.search.text = data.query;

        /**
         * If this is a new search, set the page to be 1.
         */
        if ($stateParams.query !== self.search.text) {
          self.search.page = 1;
        }

        /**
         * Track the page view and search event.
         */
        gtmTracking.trackEvent('search');

        if (config.getSetting('debug', false)) {
          console.log('track a search');
        }

        /**
         * Execute the search.
         */
        self.executeSearch(self.search.text);

        /**
         * Remove focus from the input.
         */
        if (document.activeElement != document.body) {
          document.activeElement.blur();
        }
      });

      $scope.$on('$viewContentLoaded', function(event) {
        $(document).on('focus', '.cr-input-group__input', function(){
          $(this).parent().addClass('cr-input-group--focused');
        });
        $(document).on('blur', '.cr-input-group__input', function(){
          $(this).parent().removeClass('cr-input-group--focused');
        });
      });

    }]);

}());