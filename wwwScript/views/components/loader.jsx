var React = require('react');

//
// Usage:
//  <Loader src={ xhrUrl } component={ ElementWhereTheXHRDataIsAppliedToAsProps } />
//
var Loader = React.createClass({

  propTypes: {
    src: React.PropTypes.string
  },

  getDefaultProps: function () {
    return { component: 'div' };
  },

  getInitialState: function() {
    // fallback so we dont get undefined
    return {};
  },

  componentDidMount: function() {
    if (!this.props.src) { return; }

    var xhr = this._xhr = new XMLHttpRequest();
    xhr.onload = this._handleLoad;
    xhr.onerror = this._handleError;
    xhr.open('GET', this.props.src);
    xhr.send();
  },

  _handleLoad: function() {
    var statusCode = this._xhr.status;

    if (Math.floor(statusCode / 100) !== 2) {
      return this._handleError();
    }

    var data = JSON.parse(this._xhr.responseText);
    this.setState({
      loaded: true,
      data: data
    });
  },

  _handleError: function() {
    this.setState({ errored: true });
  },

  render: function() {
    if (this.state.errored) {
      return (
        <div>
          An error occured<br/>
          Please <a href="javascript:location.reload()">reload</a> the page
        </div>
      );
    }
    if (!this.state.loaded) {
      return <div>loading</div>
    }

    var props = this.state.data || this.props;

    return React.createElement(this.props.component, props)
  }

});


module.exports = Loader;