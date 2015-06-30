var React = require('react');

var ProfileEntry = React.createClass({
  render: function() {
    var entry = this.props.entry;
    
    switch(entry._type) {
      case 'created':
        return <li>{ entry.timestamp } account created</li>
      case 'map':
        return (<li>{ entry.timestamp } map <a href={ '/u/' + this.props.user + '/' + entry.file }>{entry.name}</a> uploaded</li>);
      default:
        return <li>unmapped</li>
    }
  }
});

module.exports = ProfileEntry;