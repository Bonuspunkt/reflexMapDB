var fs = require('fs');

module.exports = function(path) {
  var stream = fs.createWriteStream(path, { flags: 'a' });

  return {
    write: function(data) {
      data.timestamp = new Date();

      stream.write(JSON.stringify(data) + '\n');
    },
    close: function() {
      stream.close();
    }
  };
}