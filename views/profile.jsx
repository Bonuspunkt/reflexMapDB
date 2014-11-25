var React = require('react');

var DefaultLayout = require('./layouts/default');
var ProfileEntry = require('./components/profileEntry');

var Profile = React.createClass({
  render: function() {
    var profile = this.props.profile;
    var maps = this.props.maps;

    if (!profile) {
      return (
        <DefaultLayout title=":D" user={this.props.user}>
          user does not exist
        </DefaultLayout>
      );
    }

    return (
      <DefaultLayout title={ 'Profile ' + profile.name } user={this.props.user}>
        <img className="profileImg" src={ profile.imgurl } />
        <h2>{ profile.name }</h2>
        <h3>Maps</h3>
        <ul>
          { maps.map(function(map) { 
              return <li><a href={ '/m/' + map.id }>{ map.name || map.filename }</a></li> 
            })
          }
        </ul>

        <h3>Upload map</h3>
        <form action="/upload" method="POST" encType="multipart/form-data">
          <input type="hidden" name="_csrf" value={ this.props.csrfToken } />
          <p>
            <label htmlFor="upload_file">map file</label>
            <input id="upload_file" type="file" name="map" />
          </p>

          <p>
            By posting your map here you acknowledge:
            <ul>
              <li>That you have full rights to the map you are posting</li>
            </ul>
          </p>

          <button type="submit">submit</button>
        </form>

      </DefaultLayout>
    );

  }
});

module.exports = Profile;