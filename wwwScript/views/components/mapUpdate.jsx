var React = require('react');
var mapTypes = require('../../../const').mapTypes;

var MapUpdate = React.createClass({
  render: function() {

    var csrf = this.props.csrfToken;
    var map = this.props.map;

    return (
      <form method="POST" encType="multipart/form-data" style={ { border: '1px solid black', padding: 10 } }>
        <h3>update map infos</h3>
        <input type="hidden" name="_csrf" value={ csrf } />
        <p>
          <label>name</label>
          <input name="name" defaultValue={ map.name } />
        </p>

        <p>
          <span>type</span>
          {
            Object.keys(mapTypes)
              .filter(function(type){ return mapTypes[type]; })
              .map(function(type) {
                return (
                  <label>
                    <input key={ type } name={ type } type="checkbox" defaultChecked={ map.types & mapTypes[type] } />
                    {type}
                  </label>
                );
            })
          }
        </p>
        <p>
          <label>readme</label><br/>
          <textarea name="readme"
            style={ { maxWidth: '100%', width: '100%', height: 200 } }
            defaultValue={ map.readme }/>
        </p>
        <input type="submit" />
      </form>
    );
  }
});

module.exports = MapUpdate;