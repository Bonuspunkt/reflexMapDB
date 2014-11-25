var React = require('react')
var DefaultLayout = require('./layouts/default');

var Home = React.createClass({
  render: function() {

    return (
      <DefaultLayout user={this.props.user}>
        <h2>alright this is a first shot</h2>
        <ul>
          <li>signin on the top right with steam</li>
          <li>you can upload maps from your profile</li>
          <li>there is also a map listing with filtering by type</li>
        </ul>
        <h2>stuff that still needs to be done</h2>
        <ul>
          <li>api</li>
          <li>cli to update all subscribed maps (required for servers) which uses the api</li>
          <li>comment on map</li>
          <li>change background to black, use comic sans ms and brightskin green ;)</li>
          <li><em>maybe</em> user requests</li>
        </ul>
      </DefaultLayout>
    );
  }
});

module.exports = Home;
