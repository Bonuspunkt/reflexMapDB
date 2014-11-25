var React = require('react');

var DefaultLayout = require('./layouts/default');
var ProfileEntry = require('./components/profileEntry');
var MapUpload = require('./components/mapUpload');
var StarAuthor = require('./components/starAuthor')

var Profile = React.createClass({
  render: function() {
    var profile = this.props.profile;
    var maps = this.props.maps;
    var user = this.props.user
    var csrfToken = this.props.csrfToken;

    if (!profile) {
      return (
        <DefaultLayout title=":D" user={user}>
          user does not exist
        </DefaultLayout>
      );
    }

    return (
      <DefaultLayout title={ 'Profile ' + profile.name } user={this.props.user}>
        <img className="profileImg" src={ profile.imgurl } />
        <h2>{ profile.name }</h2>
        {
          user 
            ? <StarAuthor authorId={ profile.id } stars={ this.props.stars } user={ user } csrfToken={ csrfToken } />
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

      </DefaultLayout>
    );

  }
});

module.exports = Profile;