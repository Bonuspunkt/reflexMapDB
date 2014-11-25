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
          <footer style={ {textAlign: 'center', marginTop: 50} }>
            <small>
              public test - searching for someone to take over<br/>
              stack: <a href="https://nodejs.org">node.js</a> / <a href="http://www.postgresql.org/">PostgreSQL</a>
            </small>
          </footer>
        </body>
      </html>
    );
  }
});

module.exports = DefaultLayout;