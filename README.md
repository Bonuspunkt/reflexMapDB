# Reflex Map DB

[![Greenkeeper badge](https://badges.greenkeeper.io/Bonuspunkt/reflexMapDB.svg)](https://greenkeeper.io/)

## required
- nodejs 0.10+
- postgresql 9.3+

## setup
### database
- execute `createdb <database>`
- execute `psql -d <database> -f db/tables.sql`
- execute `psql -d <database> -f db/functions.sql`
- execute `psql -d <database> -f node_modules/connect-pg-simple/table.sql`

### webView
generate the production version of (reflexWebMapView)[https://github.com/Bonuspunkt/reflexWebMapView] and place it at `wwwRoot\webView`

### mapdb
- run `npm install .`
- cp settings.json.example settings.json
- get the steam api key via http://steamcommunity.com/dev/apikey
- edit settings.json to repesent your current setup

## optional - setup nginx
you may search for proper instructions this is just a raw outline of the stuff i changes

### as reverse proxy
```
server {
  // ...

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
  }
```

### enable compression
make sure following types are present at `gzip_types`
- `text/x-reflexmap` (gives ~20x compression)
- `application/javascript` (gives ~4x compression at webView/script.js)
- `application/json`
- `text/html`
- `text/css`

