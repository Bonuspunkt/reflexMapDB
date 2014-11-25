var React = require('react');

var StarMap = React.createClass({
  render: function() {
    var csrfToken = this.props.csrfToken;
    var user = this.props.user;
    var stars = this.props.stars;

    var isStarred = stars.length && stars.some(function(star) {
      return star.authorid === user.id;
    });

    return (
      <form action={ '/m/' + this.props.mapId + (isStarred ? '/unstar' : '/star') } method="POST" encType="multipart/form-data">
        <input type="hidden" name="_csrf" value={ this.props.csrfToken } />
        Stars: { stars.length }
        <span> - </span>
        {
          isStarred 
            ? <button className="starButton starButton-unstar" type="submit">Unstar</button>
            : <button className="starButton starButton-star" type="submit">Star</button>
        }        
      </form>
    );
  }
});

module.exports = StarMap;