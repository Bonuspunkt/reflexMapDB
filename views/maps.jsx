var React = require('react');
var DefaultLayout = require('./layouts/default');

var Maps = React.createClass({
  render: function() {
    var maps = this.props.maps || [];

    var mapEls = maps.map(function(map) {
      return (
        <div>
          { map.updated.toJSON() }
          <span> - </span>
          <a href={ '/u/' + map.authorid }>{ map.authorname }</a>
          <span> / </span>
          <a href={ '/m/' + map.id }>{map.name || map.filename }</a>
        </div>
      );
    });

    return (
      <DefaultLayout title="upload map" user={ this.props.user }>
        <nav className="subNav">
          <a href="/maps/all">all</a>
          <a href="/maps/1v1">1v1</a>
          <a href="/maps/2v2">2v2</a>
          <a href="/maps/tdm">tdm</a>
          <a href="/maps/ffa">ffa</a>
        </nav>
        <h2>maps</h2>
        { mapEls }
      </DefaultLayout>
    );
  }
});

module.exports = Maps;