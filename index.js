var fs = require('fs');
var path = require('path');
var util = require('util');

var createJsonStreamWriter = require('./lib/createJsonStreamWriter');
var readJsonStream = require('./lib/readJsonStream')
var settings = require('./settings');

var express = require('express');
var multer = require('multer');
var logger = require('morgan');
var session = require('express-session');

var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

var wwwRoot = path.resolve(__dirname, 'wwwRoot');

// TODO:
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

    var targetDir = path.resolve(wwwRoot, profile.id);
    fs.mkdir(targetDir, function(err) {
      if (!err) { 
        var profilePath = path.resolve(targetDir, 'profile.jsonStream');
        var profileStream = createJsonStreamWriter(profilePath);
        profileStream.write({
          _type: 'created',
          id: profile.id,
          name: profile.displayName,
          photo: profile.photos[2].value
        });
        profileStream.close();
      }

      profile.identifier = identifier;
      return done(null, profile); 
    });
  }
));




var app = express();

// configure Express
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());

app.use(logger('dev'));
app.use(multer({ fields: 10, fileSize: 2 * 1024 * 1024, files: 1 }));
app.use(session({ resave: true,
                saveUninitialized: true,
                secret: settings.secret }));  
// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(wwwRoot));


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

app.get('/u/:steamId', function(req, res){
  readJsonStream(path.resolve(wwwRoot, req.params.steamId, 'profile.jsonStream'), function(err, entries) {
    res.render('profile', { user: req.user, entries: entries });
  })
});

app.get('/u/:steamId/:map', function(req,res) {


  readJsonStream(path.resolve(wwwRoot, req.params.steamId, req.params.map + '.jsonStream'), function(err, entries) {
    res.render('map', { 
      user: req.user, 
      mapPath: req.params.steamId + '/' + req.params.map,
      entries: entries
    });
  });
});

app.get('/maps/:type', function(req, res) {
  var valid = ['all', '1v1', '2v2', 'tdm', 'ffa'];
  if (valid.indexOf(req.params.type) === -1) {
    return res.end('what are you trying')
  }

  readJsonStream(path.resolve(wwwRoot, req.params.type + '.jsonStream'), function(err, maps) {
    if (err) { console.log(err); }
    res.render('maps', { user: req.user, maps: maps });
  })
});

app.get('/upload', ensureAuthenticated, function(req, res) {
  res.render('upload', { user: req.user });
});

app.post('/upload', ensureAuthenticated, function(req, res) {

  if (!req.files.map) {
    Object.keys(req.files).forEach(function(key) { fs.unlink(req.files[key].path); });
    return res.end('how about uploading a file?');
  }

  var userDir = path.resolve(wwwRoot, req.user.id);

  var filename = req.files.map.originalname;
  var filenameWithoutExtension = filename.substring(0, filename.lastIndexOf('.'));

  var mapFile = path.resolve(userDir, filename);
  var types = [];
  if (req.body['1v1']) { types.push('1v1'); }
  if (req.body['2v2']) { types.push('2v2'); }
  if (req.body.tdm) { types.push('tdm'); }
  if (req.body.ffa) { types.push('ffa'); }

  fs.exists(mapFile, function(exists) {
    if (exists) { fs.unlinkSync(mapFile); }

    fs.rename(req.files.map.path, path.resolve(userDir, mapFile));
    
    // write readme
    fs.createWriteStream(path.resolve(userDir, filenameWithoutExtension + '.txt')).end(req.body.readme);
    
    // write to user profile
    var profilePath = path.resolve(userDir, 'profile.jsonStream');
    var profile = createJsonStreamWriter(profilePath);
    profile.write({_type: 'map', file: filenameWithoutExtension, name: req.body.name });
    profile.close();

    // write map infos
    var mapPath = path.resolve(userDir, filenameWithoutExtension + '.jsonStream');
    var map = createJsonStreamWriter(mapPath);
    map.write({ _type: exists ? 'update' : 'create', types: types, name: req.body.name, user: { id: req.user.id, name: req.user.displayName } });
    map.close();

    // write entry to map types
    types.forEach(function(type) {
      var typePath = path.resolve(wwwRoot, type + '.jsonStream');
      var typeStream = createJsonStreamWriter(typePath);
      typeStream.write({ name: req.body.name, user: { id: req.user.id, name: req.user.displayName }, filename: filenameWithoutExtension })
    });
    // and the other map view
    var commonMapPath = path.resolve(wwwRoot, 'all.jsonStream');
    var commonStream = createJsonStreamWriter(commonMapPath);
    commonStream.write({ name: req.body.name, user: { id: req.user.id, name: req.user.displayName }, filename: filenameWithoutExtension })

    res.redirect('/u/' + req.user.id + '/' + filenameWithoutExtension);

  });
});



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
