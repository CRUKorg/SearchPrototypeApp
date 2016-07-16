(function () {
  'use strict';

  app.service('GTMTracking', ['configurationService', '$log', function (config, $log) {
    var self = this;

    self.queuedEvents = [];
    self.searchName = config.getSetting('searchName', 'Untitled Angular search');

    /**
     * Track an event, add it to the queue of events to log via GTM and
     * dataLayer. These get processed when self.sendEvents is called.
     */
    self.trackEvent = function(event) {
      if (!angular.isString(event)) {
        $log.log("An event is trying to be tracked, but it's not a string.");
        return false;
      }

      self.queuedEvents.push(event);
    };

    /**
     * Send queued events, this function is called once the search has returned
     * a response and not before, that way we get the number of results to work
     * with.
     */
    self.sendEvents = function(query, page, totalResults, searchGeo) {
      var dataLayer = window.dataLayer || [];
      searchGeo = searchGeo || false;
      var i;

      for (i = 0; i < self.queuedEvents.length; ++i) {
        var eventEntry = self.queuedEvents[i];

        var gtmSearchTitle = self.searchName;
        if (totalResults < 1) {
          gtmSearchTitle += ' - Failed';
        }

        var push_object = {
          'event': 'site search event',
          'content-name': '/search?query=' + query + '&cat=' + gtmSearchTitle + '&page=' + page,
          'keyword': query,
          'target': gtmSearchTitle,
          'value': totalResults,
          'searchFiltered': eventEntry === 'searchFiltered' ? 'true' : 'false',
          'searchSorted': eventEntry === 'searchSorted' ? 'true' : 'false',
          'searchPaged': eventEntry === 'searchPaged' ? 'true' : 'false',
          'searchNoResults': totalResults < 1 ? 'true' : 'false',
          'searchGeo': searchGeo  ? 'true' : 'false',
          'pageNumber': page
        };

        dataLayer.push(push_object);
      }

      /**
       * Clear the queue.
       */
      self.queuedEvents = [];
    };


  }]);

}());