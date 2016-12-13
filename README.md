<h1>Realtime chat app</h1>

<h3>Environment variables</h3>
`dotenv` package is used for setting environment variables<a href="https://github.com/motdotla/dotenv">details</a><br />
Create `.env` file in project root folder and add variables in there<br />
Currently used variables:<br />
- `PORT` - Port for the api service server
- `NODE_ENV` - Node environment variable. Possible settings are `development` or `production`

<h3>NPM Scripts</h3>
Use terminal or IDE to start these scripts

- `npm run clean` - Deletes build directory from project
- `npm run build` - Builds api from `api` folder
- `npm run build:watch` - Builds api and watches for changes in the `api` folder
- `npm run build:client` - Builds client code from `src` in minified format
- `npm run build:client:watch` - Builds client code and watches for changes in `src` folder
- `npm run build:all` - Builds all project in respective folders
- `npm run lint:api` - Checks code style for api
- `npm run lint:client` - Checks code style for client
- `npm run start:dev` - Starts dev api service
- `npm run start:client` - Starts webpack dev server on port 8080
