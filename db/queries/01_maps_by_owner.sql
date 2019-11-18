SELECT *
FROM maps
  JOIN users ON users.id = maps.owner_id
WHERE maps.owner_id = users.id
