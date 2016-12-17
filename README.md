<h1>Little talks chat app</h1>

<h3>Environment variables</h3>
`dotenv` package is used for setting environment variables<a href="https://github.com/motdotla/dotenv">details</a><br />
Create `.env` file in project root folder and add variables in there<br />
Currently used variables:<br />
- `PORT` - Port for the api service server
- `NODE_ENV` - Node environment variable. Possible settings are `development` or `production`
- `MONGO` - Mongo connection string which contains database name. Defaults to `mongodb://localhost:27017/chat`
- `JWT_SECRET` - Secret used to encrypt and decrypt JWT tokens
- `FACEBOOK_ID` - ID of the Facebook application. Get ID <a href=developers.facebook.com>here</a>
- `FACEBOOK_SECRET` - Secret of the Facebook application. Get secret <a href=developers.facebook.com>here</a>
- `FACEBOOK_CALLBACK` - Callback called when login is successful. Must be same as in Facebook application definition

<h5>Example<h5> 
 `NODE_ENV=development`

<h3>NPM Scripts</h3>
Use terminal or IDE to start these scripts

- `npm run clean` - Deletes build directory from project
- `npm run build` - Builds api from `api` folder
- `npm run build:watch` - Builds api and watches for changes in the `api` folder
- `npm run build:client` - Builds client code from `src` in production ready format
- `npm run build:client:watch` - Builds client code and watches for changes in `src` folder
- `npm run build:all` - Builds all project in respective folders
- `npm run lint:api` - Checks code style for api
- `npm run lint:client` - Checks code style for client
- `npm run start:dev` - Starts dev api service
- `npm run start:client` - Starts webpack dev server on port 8080 for client development with proxy to `http://localhost:3000`

<h3>Structure</h3>
Project structure is simple, all backend API code is in the `api` folder. Client code is in the `src` folder. Mobile-app code is in the `Android` folder.
