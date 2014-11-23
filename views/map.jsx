var React = require('react');
var DefaultLayout = require('./layouts/default');

var Map = React.createClass({
  render: function() {

    return (
      <DefaultLayout title="upload map" user={ this.props.user }>
        <h2>map</h2>
        <h3>{this.props.mapName}</h3>
        <a href={ "/webView/#/" + this.props.mapPath }>preview</a>
        <div>readme</div>
        tbd
        <div><a href={ '/' + this.props.mapPath + '.map' }>download</a></div>
      </DefaultLayout>
    );
  }
});

module.exports = Map;