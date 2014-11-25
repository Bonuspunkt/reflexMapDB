var React = require('react');

var HeadBar = React.createClass({
  render: function() {

    var items = [
        <a key="home" href="/">Home</a>,
        <a key="maps" href="/maps/all">Maps</a>,
    ];

    if (this.props.user) {
      items.push(
        <div key="user" style={ {float: 'right' } }>
          <a href={ '/u/' + this.props.user.id }>
            {this.props.user.name}
          </a>
          <a href="/logout">Log Out</a>
        </div>
      );
    } else {
      items.push(
        <div key="login" style={ {float: 'right' } }>
          <a href="/auth/steam">
            <img src="https://steamcommunity-a.akamaihd.net/public/images/signinthroughsteam/sits_small.png" />
          </a>
        </div>
      );
    }

    return (
      <header>
        <h1>reflex map db</h1>
        <nav className="topNav">
        { items }
        </nav>
      </header>
    );
  }
});

module.exports = HeadBar;