# A Basic Node API

This project will have the source code to a basic Node API, and will explain the data modeling. 

## The Task

The concept is that we run a credit card company and want to keep track of a user's purchase history, so that we can later use this information to check for fraudulant seeming purchases. To keep it simple, every time a user makes a purchase, the location of their purchase is sent to the API. We also want to be able to search the user's purchase history.

More formally, create an API with the following two endpoints:

* POST /visit - accepts 'userId' and 'locationName' in the request body, and generates a 'visitId' for this purchase.
* GET /visit - accepts 'visitId' OR 'userId' and 'searchstring' in the URL query, and returns an array of the visit(s) that were POSTed matching that criteria. 

### Example Requests:

* POST { userId: patrick, locationName: “burgershop” }
* Returns: { visitId: “abcde” }


* GET visit?visitId=5bdf7fd9770b0a01bd20cf42
* Returns: [{ userId: patrick, locationName: “burgershop”, visitId: “abcde” }]


* POST { userId: patrick, locationName: “computerstore” }
* Returns: { visitId: “xyz” }


* GET /visit?userId=patrick&searchString=BURGERSHOP LAS VEGAS
* Returns: [{ userId: patrick, locationName: “burgershop”, visitId: “abcde” }]


* POST { userId: “mike”, locationName: “computerstore” }
* Returns: { visitId: “qwerty” } 


* GET /visit?userId=mike&searchString=LIBRARY
* Returns: []

## Database Choice

Since we want to group purchase histories by user, and may eventually want to add more information for each purchase (like price paid, for example), we'll choose a NoSQL database; MongoDB, in particular. 

Our data collection will be a collection of users, where each user has an Id, and an array representing their purchase history. Each item in the array will be an object with the particular purchase's details, including the locationName, visitId, and date. It should look something like this:

```
{
userId: string,
purchaseHistory: [
	{
	visitId: string,
	locationName: string,
	date: DateTime
	}
	]
}
```

## Relevant Files

* Procfile - Used to start the project if we push it to Heroku.
* index.js - Starts our server.
* server.js - Holds our server code. Initializes DB connection. Maps routing to be handled by other files.
* /routes/all_routes.js - Maps the routes (endpoints) for our server to their controller functions.
* /controllers/visit.js - Handles the response for our /visit endpoint.
* /config/config.js - Holds our configurations.

## Deployment Instructions

1. Create a file named config.js in the /config folder.
2. Add the following code into it:
```
module.exports = {
    mongoURI: "YOUR MONGO URI HERE"
    }
```
3. In /config/config.js, replace the mongoURI with your own database's URI.
4. Install the npm modules with `npm install` .

### Local Testing

To test locally in your web browser...

1. Type `npm start` in the terminal to run the server.
2. The default port is 3000. The url to test in your browser will be [http://localhost:3000](http://localhost:3000). Go there and see if the application behaves as expected.
3. Use Postman to test the endpoints. 

### Deployment To Heroku.

1. Login to Heroky with `heroku login`
2. Create the heroku space with `heroku create`
3. Push to heroku with `git push heroku master` (you might need to `git init` first).
4. `heroku open` to  see the heroku URL.
5. Test the endpoints with Postman.

## TODO

* Remove the console.log() s.
* Add try-catch blocks for expected failures. 
* Add analytics. 
* Set up linting.
* Set up unit testing.
* Add authentication for the endpoints.
* Create more postman tests.
* Create swagger document.
* Set up a pipeline for continuous integration. 