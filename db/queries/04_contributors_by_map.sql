SELECT contributors.user_id
FROM contributors
  JOIN maps ON maps.id = contributors.map_id
WHERE contributors.map_id = maps.id;
