CREATE or REPLACE FUNCTION getAuthorId(
  pOpenId varchar(512),
  pName text,
  pImgUrl text
) 
RETURNS INTEGER as $$
DECLARE result Author.Id%type;
BEGIN

  SELECT Id INTO result FROM Author WHERE OpenId = pOpenId;

  IF result IS NULL THEN
    INSERT INTO Author (OpenId, Name, ImgUrl)
    VALUES (pOpenId, pName, pImgUrl)
    RETURNING Id into result;
  END IF;

  RETURN result;

END;
$$ LANGUAGE plpgsql;


CREATE or REPLACE FUNCTION saveMap(
  pAuthorId integer,
  pFilename varchar(260)
)
RETURNS INTEGER as $$
DECLARE vMapId Map.Id%type;
DECLARE vAuthorId Map.AuthorId%type;
BEGIN
  SELECT AuthorId INTO vAuthorId FROM Map WHERE lower(Filename) = lower(pFilename);

  IF vAuthorId IS NULL THEN
    INSERT INTO Map (AuthorId, Filename)
    VALUES (pAuthorId, pFilename);
  ELSIF vAuthorId = pAuthorId THEN
    UPDATE Map
       SET Updated = current_timestamp
     WHERE AuthorId = pAuthorId
       AND lower(Filename) = lower(pFilename);
  ELSE
    RAISE unique_violation USING MESSAGE = 'Duplicate Map: ' || pFilename;
  END IF;

  SELECT Id INTO vMapId FROM Map WHERE lower(Filename) = lower(pFilename);

  RETURN vMapId;
END;
$$ LANGUAGE plpgsql;
