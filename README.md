This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Available Scripts
In the project directory, you can run:
### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
The page will reload when you make changes.\
You may also see any lint errors in the console.
### `npm test`
Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\

The Spotify API authorization flow was mainly found from https://github.com/Kickblip. I got some help adapting this code for my project from my brother.

This web app utilizes the Spotify Web API to allow the user to log in with their Spotify account in order to receive a "taste match" percentage based on their music taste and Dean Khurana's. To run the program locally, run npm run start in your terminal. You need to have node installed. You will be redirected to the login page where you click the login button to be taken to Spotify. Right now, the project is in developer mode, so Spotify accounts need to be whitelisted in order to log in. To use the API, use the account ____________. You can now securely log in with the Spotify profile and receive a "token" from Spotify. You are then redirected to the home page where you will see your "taste match" percentage. The token expires after an hour, so the token refresh button refreshes it to restart this timer. 

video url