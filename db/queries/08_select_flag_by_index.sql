SELECT flags.id
FROM flags
  JOIN maps ON maps.id = flags.map_id
WHERE maps.id = 3
ORDER BY flags.id
OFFSET 3 FETCH FIRST
1 ROWS ONLY
;
