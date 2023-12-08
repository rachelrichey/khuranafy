This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Available Scripts
In the project directory, you can run many commands.
For running just the backend, use 
### `cd backend && npm run start`
For just the frontend, user
### `cd frontend && npm run start`
But you can start both by running this command in the root directory:
### `npm run start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
### `npm run build`
Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.
The build is minified and the filenames include the hashes.\

The Spotify API authorization flow was mainly found from https://github.com/Kickblip. I got some help adapting this code for my project from my brother. I didn't realize how difficult using the Spotify API would be, so I couldn't implement the custom playlist feature in time. I wanted to use React because I am currently using it for Datamatch comp and wanted extra practice, but it made using the API even more difficult. I also didn't realize that I didn't actually have to implement a backend and frontend until I was too in deep. Though the features all work fine, I had higher expectations for my final project- but I think that I put in a lot of work.

This web app utilizes the Spotify Web API to allow the user to log in with their Spotify account in order to receive a "taste match" percentage based on their music taste and Dean Khurana's. To run the program locally, run npm run start in your terminal in the khuranafy directory. You need to have node installed. You will be redirected to the login page where you click the login button to be taken to Spotify. Right now, the project is in developer mode, so Spotify accounts need to be whitelisted in order to log in. To use the API with the tester account I made, use these credentials:
email (gmail): khuranafy@gmail.com
password: computerscience

You can now securely log in with the Spotify profile and receive a "token" from Spotify. You are then redirected to the home page where you will see your "taste match" percentage. The token expires after an hour, so the token refresh button refreshes it to restart this timer. 

Video:
https://youtu.be/AGBMWSnXJ4U
