# Reflex Map DB

## required
- nodejs 0.10+
- postgresql 9.3+

## setup
### database
- execute `createdb <database>`
- execute `psql -d <database> -f db/tables.sql`
- execute `psql -d <database> -f db/functions.sql`
- execute `psql -d <database> -f node_modules/connect-pg-simple/table.sql`

### the mapdb
- run `npm install .`
- cp settings.json.example settings.json
- get the steam api key via http://steamcommunity.com/dev/apikey
- edit settings.json to repesent your current setup

## done
