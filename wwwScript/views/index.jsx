var React = require('react')
var DefaultLayout = require('./layouts/default');
var HomeBody = require('./components/homeBody')

var Home = React.createClass({
  render: function() {

    return (
      <DefaultLayout user={this.props.user}>
        <HomeBody />
      </DefaultLayout>
    );
  }
});

module.exports = Home;
