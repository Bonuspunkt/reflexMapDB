var React = require('react');
var DefaultLayout = require('./layouts/default');

var template = [
  '<title>',
  '<1v1/2v2/TDM/FFA>',
].join('\r\n');

var Upload = React.createClass({
  render: function() {
    return (
      <DefaultLayout title="upload map" user={ this.props.user }>
        <h2>map upload</h2>
        <form action="/upload" method="POST" encType="multipart/form-data">
          
          <p>
            <label htmlFor="upload_file">map file</label>
            <input id="upload_file" type="file" name="map" />
          </p>

          <p>
            <label>name</label>
            <input name="name" placeholder="name" />
          </p>

          <p>
            <span>type</span>
            <label><input name="1v1" type="checkbox"/>1v1</label>
            <label><input name="2v2" type="checkbox"/>2v2</label>
            <label><input name="tdm" type="checkbox"/>TDM</label>
            <label><input name="ffa" type="checkbox"/>FFA</label>
          </p>
          <p>
            <label>readme</label><br/>
            <textarea name="readme" 
              style={ { width: 800, height: 200 } } />
          </p>

          <p>
            By posting your map here you acknowledge:
            <ul>
              <li>That you have full rights to the map you are posting</li>
            </ul>
          </p>

          <button type="submit">submit</button>
        </form>
      </DefaultLayout>
    );
  }
});

module.exports = Upload;