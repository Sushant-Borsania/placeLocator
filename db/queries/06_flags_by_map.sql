SELECT *
FROM flags
  JOIN maps ON flags.map_id = maps.id
WHERE flags.map_id = maps.id;
