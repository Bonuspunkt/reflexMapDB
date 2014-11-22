var React = require('react')
var DefaultLayout = require('./layouts/default');

var Home = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title} user={this.props.user}>
        <h2>Last 10 updated maps</h2>
        <ul>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">Hot Armor</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">herpiderp</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">3</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">4</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">5</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">6</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">7</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">8</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">9</a></li>
          <li><a href="/u/<steamId>">Bonuspunkt</a> / <a href="/u/<steamId>/<mapName>">10</a></li>
        </ul>
      </DefaultLayout>
    );
  }
});

module.exports = Home;
