var React = require('react');

var ProfileEntry = require('./profileEntry');
var MapUpload = require('./mapUpload');
var StarAuthor = require('./starAuthor')

var ProfileBody = React.createClass({

  getInitialState: function() {
    debugger;
    return { ohHi: true };
  },

  render: function(){

    var data = this.props;

    var profile = data.profile;
    var maps = data.maps;
    var user = {};
    var csrfToken;

    if (!profile) {
      return <span>user does not exist</span>
    }

    return (
      <div>
        <img className="profileImg" src={ profile.imgurl } />
        <h2>{ profile.name }</h2>
        {
          user
            ? <StarAuthor authorId={ profile.id } stars={ data.stars } user={ user } csrfToken={ csrfToken } />
            : ''

        }
        <h3>Maps</h3>
        <ul>
          { maps.map(function(map) {
              return <li><a href={ '/m/' + map.id }>{ map.name || map.filename }</a></li>
            })
          }
        </ul>

        {
          user && user.id === profile.id
            ? <MapUpload csrfToken={this.props.csrfToken} />
            : ''
        }
      </div>
    );
  }
});

module.exports = ProfileBody;