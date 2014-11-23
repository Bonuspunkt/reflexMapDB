var React = require('react');

var HeadBar = React.createClass({
  render: function() {

    var items = [
        <a href="/">Home</a>,
        <a href="/maps/all">Maps</a>,
    ];

    if (this.props.user) {
      items.push(
        <a href="/upload">Upload</a>,
        <div style={ {float: 'right' } }>
          <a href={ '/u/' + this.props.user.id }>
            {this.props.user.displayName}
          </a>
          <a href="/logout">Log Out</a>
        </div>
      );
    } else {
      items.push(
        <div style={ {float: 'right' } }>
          <a href="/auth/steam">
            <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png" />
          </a>
        </div>
      );
    }

    return (
      <header>
        <h1>reflex map db prealpha prototype</h1>
        <nav>
        { items }
        </nav>
      </header>
    );
  }
});

module.exports = HeadBar;