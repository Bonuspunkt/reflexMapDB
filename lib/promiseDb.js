var Q = require('q');
var db = require('./db');

var result = {};
Object.keys(db).forEach(function(type) {
  result[type] = {};
  Object.keys(db[type]).forEach(function(fn) {

    result[type][fn] = function() {

      var deferred = Q.defer();
      var args = Array.prototype.slice.call(arguments);

      args.push(deferred.makeNodeResolver());

      db[type][fn].apply(null, args)

      return deferred.promise;
    }
  });
});

module.exports = result;