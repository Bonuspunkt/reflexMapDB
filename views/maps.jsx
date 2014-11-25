var React = require('react');
var DefaultLayout = require('./layouts/default');
var mapTypes = require('../const').mapTypes;

var Maps = React.createClass({
  render: function() {
    var maps = this.props.maps || [];

    var mapEls = maps.map(function(map) {
      return (
        <div key={map.id}>
          { map.updated.toJSON() }
          <span> - </span>
          <a href={ '/u/' + map.authorid }>{ map.authorname }</a>
          <span> / </span>
          <a href={ '/m/' + map.id }>{map.name || map.filename }</a>
        </div>
      );
    });

    return (
      <DefaultLayout title="maps" user={ this.props.user }>
        <nav className="subNav">
          { 
            Object.keys(mapTypes).map(function(mapType, i) {
              return <a key={ mapTypes[i] } href={ '/maps/' + mapType }>{ mapType }</a>
            })
          }
        </nav>
        <h2>maps</h2>
        { mapEls }
      </DefaultLayout>
    );
  }
});

module.exports = Maps;