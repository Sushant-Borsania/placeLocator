SELECT distinct(maps.id)
FROM maps
  JOIN contributors ON contributors.map_id = maps.id
  JOIN users on contributors.user_id = users.id
WHERE contributors.user_id = (SELECT users.id
FROM users
WHERE users.username = 'VampireChick');
