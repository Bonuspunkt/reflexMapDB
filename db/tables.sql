
create table Author (
  Id SERIAL PRIMARY KEY,
  OpenId varchar(512) NOT NULL,
  Name text NOT NULL,
  ImgUrl text,
  Created timestamp DEFAULT current_timestamp,
  Updated timestamp DEFAULT current_timestamp,
  -- perf fields
  StarCount integer DEFAULT 0,
  MapCount integer DEFAULT 0
);

create table AuthorStar (
  AuthorId integer REFERENCES Author NOT NULL,
  StarAuthorId integer REFERENCES Author NOT NULL,
  Created timestamp DEFAULT current_timestamp,
  UNIQUE (AuthorId, StarAuthorId)
);
create index AuthorStar_AuthorId on AuthorStar (AuthorId);
create index AuthorStar_StarAuthorId on AuthorStar (StarAuthorId);


create table Map (
  Id SERIAL PRIMARY KEY,
  AuthorId integer REFERENCES Author NOT NULL,
  Filename varchar(260) NOT NULL,
  Name text,
  Types integer,
  Readme text,
  Created timestamp DEFAULT current_timestamp,
  Updated timestamp DEFAULT current_timestamp,
  -- perf fields
  StarCount integer DEFAULT 0
);
create index Map_AuthorId on Map (AuthorId);

create table MapStar (
  MapId integer REFERENCES Map NOT NULL,
  AuthorId integer REFERENCES Author NOT NULL,
  Created timestamp DEFAULT current_timestamp,
  UNIQUE (MapId, AuthorId)
);
create index MapStar_MapId on MapStar (MapId);
create index MapStar_AuthorId on MapStar (AuthorId);

create table MapComment (
  MapCommentId BIGSERIAL PRIMARY KEY,
  MapId integer REFERENCES Map NOT NULL,
  AuthorId integer REFERENCES Author NOT NULL,
  Comment text,
  Created timestamp DEFAULT current_timestamp
);
create index MapComment_MapId on MapComment (MapId);
create index MapComment_AuthorId on MapComment (AuthorId);


/* DROPZ
drop table MapComment;
drop table MapStar;
drop table Map;
drop table AuthorStar;
drop table Author;
*/