SELECT *
FROM maps
  JOIN favorite_maps ON maps.id = favorite_maps.map_id
  JOIN users ON users.id = favorite_maps.user_id
WHERE favorite_maps.user_id = users.id;
