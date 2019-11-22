# placeLocator

## What it does

- An application where collaboration between maps is encouraged! An authenticated user can create maps and share with others, whether they are logged in or not.
- A logged in user can place flags on other users created maps, can favorite other users maps, and can even add other users maps to their own collection.
- Each flag on a map contains a title, a description, and an imagine that comes from a URL.

## Photos

!["Index Page"](/docs/IndexPage.png)
!["Create New Map Page"](/docs/CreateNewMap.png)
!["Map Summary"](/docs/EditMap.png)
!["Flag on a map summary"](/docs/FlagSummary.png)

## How it works

- A user must either log in or authenticate to create maps
- A user, either logged in or not, can view all the maps and use the search function to find maps that may be relevant to them.
- When a logged in user creates a map, they will be redirected to a screen where they must name the map and categorize it, as well as drag the map to where they want the "center" of the map to be. When submitted, this map will be added to their 'My Maps'.
- When a user interacts with their own map, or another users map, they can add flags indicating their favorite locations using a search function built into the map.
  - These flags must be titled, given a description and a link to a URL showing a photo of the location.
  - Only the map owner can edit or remove these flags.
- A logged in user can choose to favorite or unfavorite a map, can add another users map to their maps.
- If a user adds a flag onto another users map, that map will be added to their 'My Contributions' section.

## Technologies used

- Maps from Leaflet
- NODE.js as a back-end
- Express framework
- ejs as view engine
- PSQL as a database
- Bootstrap css grid as a front-end
- jQuery
- Javascript

## Dependencies

- "bcrypt": "^3.0.7",
- "body-parser": "^1.19.0",
- "chalk": "^2.4.2",
- "cookie-session": "^1.3.3",
- "dotenv": "^2.0.0",
- "ejs": "^2.6.2",
- "express": "^4.17.1",
- "morgan": "^1.9.1",
- "node-localstorage": "^2.1.4",
- "node-sass": "^4.13.0",
- "node-sass-middleware": "^0.11.0",
- "npm-run-all": "^4.1.5",
- "pg": "^6.4.2",
- "pg-native": "^3.0.0",
- "uuid": "^3.3.3"

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node run start` command.
