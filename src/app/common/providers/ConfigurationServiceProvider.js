(function () {
  'use strict';

  app.provider('configurationService', function () {
    var self = this;

    self.appSettings = {
      'host': '',
      'resultsPerPage': 10,
      'debug': false,
      'strings': {}
    };

    if (typeof crukSearch !== 'undefined') {
      if (typeof crukSearch.config !== 'undefined') {
        angular.merge(self.appSettings, crukSearch.config);
      }
    }

    self.setSettingValue = function (name, value) {
      self.appSettings[name] = value;
    };

    self.get = function() {
      return self.appSettings;
    };

    /**
     * Gets an app setting.
     *
     * In the case where a nested setting is required, an array of properties in order of nesting may be supplied.
     * @param {string|string[]} key
     * @returns {string|int}
     */
    self.getSetting = function(key, fallback) {
      fallback = typeof fallback !== 'undefined' ? fallback : '';
      var setting = self.appSettings;

      if (angular.isString(key)) {
        key = [key];
      }

      if (!angular.isArray(key)) {
        return fallback;
      }

      angular.forEach(key, function(value) {
        setting = setting[value];
      });

      return setting;
    };

    self.set = function(data) {
      self.appSettings = data;
    };

    self.getString = function (name, values) {
      values = values || {};
      var regExp = /@(\w*)@/gi;
      return self.appSettings.strings[name].replace(regExp, function (match) {
        match = match.replace(/@/gi, '');
        return values[match];
      });
    };

    self.$get = function() {
      return {
        appSettings: self.appSettings,
        get: self.get,
        set: self.set,
        getSetting : self.getSetting,
        setSettingValue: self.setSettingValue,
        getString: self.getString
      };
    };
  });

}());