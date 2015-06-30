var React = require('react');

var MapUpdate = React.createClass({
  render: function() {
    return (
      <div style={ { border: '1px solid black', padding: 10 } }>
        <h3>Upload map</h3>
        <form action="/upload" method="POST" encType="multipart/form-data">
          <input type="hidden" name="_csrf" value={ this.props.csrfToken } />
          <p>
            <label>map file
              <input id="upload_file" type="file" name="map" />
            </label>
          </p>

          <p>
            By posting your map here you acknowledge:
            <ul>
              <li>That you have full rights to the map you are posting</li>
            </ul>
          </p>

          <button type="submit">submit</button>
        </form>
      </div>
    );
  }
});

module.exports = MapUpdate;