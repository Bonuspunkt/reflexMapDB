var React = require('react');
var DefaultLayout = require('./layouts/default');
var MapUpdate = require('./components/mapUpdate');
var StarMap = require('./components/starMap')

var mapTypes = require('../const').mapTypes;

var Map = React.createClass({
  render: function() {
    var map = this.props.map;
    var user = this.props.user;
    var csrfToken = this.props.csrfToken;

    if (!map) {
      return (
        <DefaultLayout user={ user }>
          could not find map
        </DefaultLayout>
      );
    }

    var types = Object.keys(mapTypes)
      .filter(function(type) { return map.types & mapTypes[type]; })
      .map(function(type) { 
        return <a href={ '/maps/' + type  }>{type}</a>
      });

    return (
      <DefaultLayout title={ 'Map - ' + (map.name || map.filename) } user={ user }>
        <h2>
          <a href={'/u/' + map.authorid }>{ map.authorname }</a>
          <span> / </span>
          { map.name || map.filename }
        </h2>

        { 
          user 
            ? <StarMap mapId={ map.id } stars={ this.props.stars } user={ user } csrfToken={ csrfToken } />
            : ''
        }

        <div>last update: { map.updated.toJSON() }</div>
        <div>created: { map.created.toJSON() }</div>
        <div>filename: { map.filename }</div>
        <div>type: { types }</div>
        
        <div style={ {margin: '10px 0'} }> 
          <a href={ "/webView/#/dl/" + map.filename }>preview</a>
          <span> - </span>
          <a href={ '/dl/' + map.filename + '.map' }>download</a>
        </div>

        { 
          (this.props.user && this.props.user.id == map.authorid)
            ? <MapUpdate csrfToken={ csrfToken } map={ this.props.map } />
            : (
              <div>
                <h3>readme</h3>
                <div stype={{ whiteSpace: 'pre-line' }}>
                  { map.readme }
                </div>
              </div>
              )
        }

        <div className="todo" style={ {display:'none'} }>

          <div>
            Comments
          </div>

        </div>
      </DefaultLayout>
    );
  }
});

module.exports = Map;