var React = require('react');
var DefaultLayout = require('./layouts/default');

var Map = React.createClass({
  render: function() {
    var map = this.props.map;

    if (!map) {
      return (
        <DefaultLayout title="upload map" user={ this.props.user }>
          could not find map
        </DefaultLayout>
      );
    }

    var updateBlock;
    if (this.props.user && this.props.user.id == map.authorid) {
      updateBlock = (
        <form method="POST" encType="multipart/form-data">
          <input type="hidden" name="_csrf" value={ this.props.csrfToken } />
          <p>
            <label>name</label>
            <input name="name" defaultValue={ map.name } />
          </p>

          <p>
            <span>type</span>
            <label><input name="1v1" type="checkbox" defaultChecked={ map.types & 1 } />1v1</label>
            <label><input name="2v2" type="checkbox" defaultChecked={ map.types & 2 } />2v2</label>
            <label><input name="tdm" type="checkbox" defaultChecked={ map.types & 4 } />TDM</label>
            <label><input name="ffa" type="checkbox" defaultChecked={ map.types & 8 } />FFA</label>
            <label><input name="defrag" type="checkbox" defaultChecked={ map.types & 16 } />Defrag</label>
          </p>
          <p>
            <label>readme</label><br/>
            <textarea name="readme" 
              style={ { width: 800, height: 200 } } />
          </p>
          <input type="submit" />
        </form>
      );
    }

    return (
      <DefaultLayout title="upload map" user={ this.props.user }>
        <h2>
          { map.name || map.filename } 
          <span> by </span>
          <a href={'/u/' + map.authorid }>{ map.authorname }</a>
        </h2>
        <div>last update: { map.updated.toJSON() }</div>
        <div>created: { map.created.toJSON() }</div>
        
        <a href={ "/webView/#/dl/" + map.filename }>preview</a>
        <div>
          <a href={ '/dl/' + map.filename + '.map' }>download</a>
        </div>

        { updateBlock }

        <div className="todo" style={ {display:'none'} }>

          <div>
            <h3>Types</h3>
          </div>
        
          <div>
            <h3>readme</h3>
            { map.readme }
          </div>

          <div>
            Comments
          </div>

          <div>
            Stars
          </div>
        </div>
      </DefaultLayout>
    );
  }
});

module.exports = Map;