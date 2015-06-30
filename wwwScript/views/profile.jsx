var React = require('react');

var DefaultLayout = require('./layouts/default');
var ProfileBody = require('./components/profileBody');

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
      <DefaultLayout title={ 'Profile ' + profile.name } user={ user }>
        <ProfileBody { ...this.props } />
      </DefaultLayout>
    );
  }
});

module.exports = Profile;