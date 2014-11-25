var fs = require('fs');
var path = require('path');
var util = require('util');
var Q = require('q');

var db = require('./lib/promiseDb');
var settings = require('./settings');

var express = require('express');
var multer = require('multer');
var logger = require('morgan');
var csrf = require('csurf')

var pg = require('pg')
var session = require('express-session');
var pgSession = require('connect-pg-simple')(session);

var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

var wwwRoot = path.resolve(__dirname, 'wwwRoot');
var mapDir = path.resolve(wwwRoot, 'dl');

var mapTypes = settings.mapTypes;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Steam profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


// Use the SteamStrategy within Passport.
//   Strategies in passport require a `validate` function, which accept
//   credentials (in this case, an OpenID identifier and profile), and invoke a
//   callback with a user object.
passport.use(new SteamStrategy({
    returnURL: settings.hostURL + 'auth/steam/return',
    realm: settings.hostURL,
    apiKey: settings.steamApiKey
  },
  function(identifier, profile, done) {

    var internalProfile = {
      openId: identifier,
      name: profile.displayName,
      imgUrl: profile.photos[2].value
    };

    db.author
      .getAuthorId(internalProfile)
      .then(function(result) {
        internalProfile.id = result.rows[0].id;
        done(null, internalProfile);
      }, function(error) {
        done(error);
      }
    );
  }
));

var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(logger('dev'));
app.use(multer({ fields: 10, fileSize: 2 * 1024 * 1024, files: 1 }));
app.use(session({
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
  resave: true,
  saveUninitialized: false,
  secret: settings.secret,
  store: new pgSession({
    pg : pg,
    conString : settings.database,
  }),
}));
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(wwwRoot));

app.use(csrf());
app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err)

  // handle CSRF token errors here
  res.status(403)
  res.send('session has expired or form tampered with')
});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steam.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
app.get('/auth/steam',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
app.get('/auth/steam/return',
  passport.authenticate('steam', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/u/:id', function(req, res){
  var authorId = req.params.id;

  Q.all([
    db.author.getById(authorId),
    db.map.getByAuthorId(authorId, 0)
  ]).then(function(results) {
    res.render('profile', { 
      user: req.user, 
      profile: results[0].rows[0],
      maps: results[1].rows,
      csrfToken: req.csrfToken(),
    });
  }, function(err) {
    res.end(':(');
  });
});

app.get('/maps/:type', function(req, res) {

  var valid = Object.keys(mapTypes);
  if (valid.indexOf(req.params.type) === -1) {
    return res.end('what are you trying')
  }

  db.map.getByType(mapTypes[req.params.type], 0).then(function(result) {
    res.render('maps', { user: req.user, maps: result.rows });
  })
});

app.get('/m/:map', function(req,res) {
  var mapId = req.params.map;
  
  Q.all([
    db.map.getById(mapId),
    db.mapStar.getByMapId(mapId),
    db.mapComment.getByMapId(mapId)
  ]).then(function(results) {

    res.render('map', {
      user: req.user,
      map: results[0].rows[0],
      stars: results[1].rows,
      comments: results[2].rows,
      csrfToken: req.csrfToken(),
    });
  }, function(err) {
    console.log(err)
    res.end(':(')
  });
});

app.post('/m/:mapId', function(req, res) {
  var type = 0;
  Object.keys(mapTypes)
    .filter(function(mapType) { return req.body[mapType]; })
    .forEach(function(mapType){ type += mapTypes[mapType]; });

  db.map.update({
    authorId: req.user.id,
    mapId: Number(req.params.mapId) ,
    name: req.body.name,
    types: type,
    readme: req.body.readme
  }).then(function(result) {
    res.redirect('/m/' + req.params.mapId);
  });
})

app.post('/upload', ensureAuthenticated, function(req, res) {

  if (!req.files.map || !/\.map$/.test(req.files.map.originalname)) {
    Object.keys(req.files).forEach(function(key) { fs.unlink(req.files[key].path); });
    return res.end('how about uploading a map file?');
  }

  // TODO: Parse uploaded file

  var filename = req.files.map.originalname.toLowerCase();
  var filenameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));

  // make one of the stupid functions
  db.map.save({ 
    authorId: req.user.id, 
    filename: filenameWithoutExtension
  }).then(function(result) {

    fs.rename(req.files.map.path, path.resolve(mapDir, filename));
    res.redirect('/m/' + result.rows[0].id);

  }, function(error) {
    fs.unlink(req.files.map.path);
    // TODO: info msg
  });
});

/*
MAP NAME

var type = 0;
Object.keys(mapTypes)
  .filter(function(mapType) { return req.body[mapType]; })
  .forEach(function(mapType){ type += mapTypes[mapType]; });

README
*/


app.listen(3000);


// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}
