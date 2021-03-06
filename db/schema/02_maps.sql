DROP TABLE IF EXISTS maps
CASCADE;
CREATE TABLE maps
(
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  map_latlong POINT NOT NULL
);
