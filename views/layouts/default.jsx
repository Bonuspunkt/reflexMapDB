var React = require('react');

var HeadBar = require('../components/headbar');

var DefaultLayout = React.createClass({
  render: function() {
    return (
      <html>
        <head>
          <title>Reflex Map DB {this.props.title}</title>
          <link rel="stylesheet" href="/stylesheet.css" type="text/css" />
        </head>
        <body>
          <HeadBar user={this.props.user} />
          {this.props.children}
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;