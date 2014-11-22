var React = require('react');

var DefaultLayout = require('./layouts/default');
var ProfileEntry = require('./components/profileEntry');

var Profile = React.createClass({
  render: function() {

    if (!this.props.entries) {
      return (
        <DefaultLayout title=":D" user={this.props.user}>
          user does not exist
        </DefaultLayout>
      );
    }

    var entries = this.props.entries;
    var created = entries.filter(function(e){ return e._type === 'created'; })[0];

    return (
      <DefaultLayout title={ 'Profile ' + create.name } user={this.props.user}>
        <h2>{ create.name }</h2>
        <img className="profileImg" src={ created.photo } />
        <ul>
          { entries.map(function(e) { return <ProfileEntry key={e.timestamp} entry={e} /> }) }
        </ul>
      </DefaultLayout>
    );

  }
});

module.exports = Profile;