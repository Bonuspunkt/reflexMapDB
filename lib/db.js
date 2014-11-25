var pg = require('pg');
var connectionString = require('../settings').database;

function query(sql, args, callback) {
  if (typeof args === 'function') {
    callback = args;
    args = undefined;
  }

  pg.connect(connectionString, function(err, client, done) {
    if (err) { return callback(err); }

    client.query(sql, args, function(err, result) {
      if (err) { 
        console.log(sql);
        return callback(err); 
      }

      done();

      callback(null, result);
    });
  });
}

var statements = {
  author: {
    get:
      'SELECT Name, ImgUrl, StarCount, MapCount ' +
      '  FROM Author ',
    getAuthorId:
      // openId, name, pic
      'SELECT getAuthorId($1, $2, $3) as Id'
  },
  authorStar: {
    star:
      'INSERT INTO AuthorStar (AuthorId, StarAuthorId) ' +
      'VALUES ($1, $2)',
    unstar: 
      'DELETE AuthorStar ' +
      ' WHERE AuthorId = $1 ' +
      '   AND StarAuthorId = $2 '
  },
  map: {
    save:
      'SELECT saveMap($1, $2) as Id',
    get:
      'SELECT Author.Id as AuthorId, ' +
      '       Author.Name as AuthorName, ' +
      '       Map.Id, ' +
      '       Map.Filename, ' +
      '       Map.Name, ' +
      '       Map.Types, ' +
      '       Map.Readme, ' +
      '       Map.Created, ' +
      '       Map.Updated, ' +
      '       Map.StarCount ' +
      '  FROM Map ' +
      '  JOIN Author ' +
      '    on Map.AuthorId = Author.Id '
  },
  mapStar: {
    star:
      'INSERT INTO MapStar (MapId, AuthorId) ' +
      'VALUES ($1, $2)',
    unstar:
      'DELETE MapStar ' +
      ' WHERE MapId = $1 ' +
      '   AND AuthorId = $2 ',
    get:
      'SELECT Author.Id as AuthorId, ' +
      '       Author.Name as AuthorName, ' +
      '       MapStar.Created ' +
      '  FROM MapStar ' +
      '  JOIN Author ' +
      '    ON Author.Id = MapStar.AuthorId '
  },
  mapComment: {
    write:
      'INSERT INTO MapComment (MapId, AuthorId, Comment) ' +
      'VALUES ($1, $2, $3)',
    get:
      'SELECT Author.Id as AuthorId, ' +
      '       Author.Name as AuthorName, ' +
      '       MapComment.Comment, ' + 
      '       MapComment.Created ' +
      '  FROM MapComment ' +
      '  JOIN Author ' +
      '    ON MapComment.AuthorId = Author.Id '
  }
};

var pageSize = 50;

module.exports = {
  author: {
    getAuthorId: function(params, callback) {
      query(
        statements.author.getAuthorId,
        [params.openId, params.name, params.imgUrl],
        callback);
    },
    save: function(author, callback) {
      if (author.authorId) {
        query(
          statements.author.update, 
          [author.authorId], 
          callback);
        return;
      }
      query(
        statements.author.insert,
        [author.authorId, author.name, author.imgUrl],
        callback)
    },
    getById: function(authorId, callback) { 
      query(
        statements.author.get + ' WHERE Id = $1 ',
        [authorId],
        callback)
    },
    getAll: function(page, callback) { 
      query(
        statements.author.get + ' LIMIT $1 OFFSET $2 ',
        [pageSize, page * pageSize],
        callback)
    }
  },
  authorStar: {
    star: function(starAuthorId, authorId, callback) {
      query(statements.authorStar.star,
        [starAuthorId, authorId],
        callback);
    },
    unstar: function(starAuthorId, authorId, callback) {
      query(statements.authorStar.unstar,
        [starAuthorId, authorId],
        callback);
    }
  },
  map: {
    save: function(map, callback) {
      query(statements.map.save,
        [map.authorId, map.filename],
        callback);
    },
    getById: function(mapId, callback) {
      query(
        statements.map.get +
          ' WHERE Map.Id = $1 ',
          [mapId],
          callback);
    },
    getByAuthorId: function(authorId, page, callback) {

      query(
        statements.map.get + 
          ' WHERE AuthorId = $1 ' +
          ' ORDER BY Updated ' +
          ' LIMIT $2 OFFSET $3 ',
        [authorId, pageSize, (page || 0) * pageSize ],
        callback)

    },
    getByType: function(type, page, callback) {
      query(
        statements.map.get + 
          ' WHERE coalesce(Types, 0) & $1 = $1 ' +
          ' ORDER BY Updated DESC ' +
          ' LIMIT $2 OFFSET $3 ',
        [type, pageSize, (page || 0) * pageSize ],
        callback)
    },
    update: function(map, callback) {
      query(
        'UPDATE Map ' +
        '   SET Name = $1, ' +
        '       Types = $2, ' +
        '       Readme = $3 ' +
        ' WHERE AuthorId = $4 ' +
        '   AND Id = $5',
        [map.name, map.types, map.readme, map.authorId, map.mapId],
        callback);
    }
  },
  mapStar: {
    star: function(mapId, authorId, callback) { },
    unstar: function(mapId, authorId, callback) { },
    getByMapId: function(mapId, callback) {
      query(
        statements.mapStar.get + ' where MapId = $1', 
        [mapId], 
        callback);
    }
  },
  mapComment: {
    write: function(mapId, authorId, comment, callback) { },
    getByMapId: function(mapId, callback) {
      query(
        statements.mapComment.get + ' where MapId = $1', 
        [mapId], 
        callback);
    }
  }
};