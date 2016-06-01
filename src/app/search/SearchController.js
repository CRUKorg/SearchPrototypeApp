(function () {
  'use strict';

  app.controller('SearchController', ['ElasticService', 'esFactory', '$log', function(ElasticService, esFactory, $log) {
    var self = this;

    /**
     * Setup variables.
     */
    self.searchInput = null;
    self.lastSearch = null;
    self.page = 1;
    self.resultsPerPage = 10;

    /**
     * Results vars.
     */
    self.error = null;
    self.results = null;

    /**
     * Form submit callback, execute a search.
     */
    self.executeSearch = function(searchInput) {
      if (searchInput !== '' && searchInput != self.lastSearch) {
        self.lastSearch = searchInput;

        /**
         * Search! First clear any errors.
         */
        self.error = null;

//ElasticService.Request().indices('elasticsearch_index_elasticproto_news');

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
              pre_tags: ['<mark>'],
              post_tags: ['</mark>'],
              encoder: 'html',
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
        }, function (error) {
          self.error = error.message;
          $log.log(error.message);
        });
      }
    };
  }]);

}());