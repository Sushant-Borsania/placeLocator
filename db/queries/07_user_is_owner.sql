SELECT maps.id
FROM maps
  JOIN users ON maps.owner_id = users.id
WHERE maps.owner_id = (SELECT users.id
FROM users
WHERE users.username = 'VampireChick');
