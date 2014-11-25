# Reflex Map DB
## required
- nodejs 0.10+
- postgresql 9.3+

## installation
### basic
- npm install .
- cp settings.json.example settings.json
- edit settings.json to repesent your current setup
- get the steam api key via http://steamcommunity.com/dev/apikey
### database
- create database
- execute db/tables.sql
- execute node_modules/connect-pg-simple/table.sql

### done? :D