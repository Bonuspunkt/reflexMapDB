var fs = require('fs');

module.exports = function(path, callback) {
  fs.readFile(path, 'utf8', function(err, data) {
    if (err) { return callback(err); }
    var entries = data
      .split(/\n/g)
      .filter(function(entry) { return entry; })
      .map(function(entry) { return JSON.parse(entry); })

    callback(err, entries);
  });
}