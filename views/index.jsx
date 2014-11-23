var React = require('react')
var DefaultLayout = require('./layouts/default');

var Home = React.createClass({
  render: function() {
    return (
      <DefaultLayout title={this.props.title} user={this.props.user}>
        <span style={ {fontSize: 72, color: '#f00'} }>
          all data will be whipped
          <br/>
          this is just a test
        </span>
      </DefaultLayout>
    );
  }
});

module.exports = Home;
