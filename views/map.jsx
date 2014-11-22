var React = require('react');
var DefaultLayout = require('./layouts/default');

var Map = React.createClass({
  render: function() {
    return (
      <DefaultLayout title="upload map" user={ this.props.user }>
        <h2>map</h2>
        <h3>{this.props.mapName}</h3>
        <iframe className="webPreview" src={ "/webView/#/" + this.props.mapPath }></iframe>
        <div>readme</div>
        <div>download</div>
      </DefaultLayout>
    );
  }
});

module.exports = Map;