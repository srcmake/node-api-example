// Load the User model.
const User = require('../models/User');

/////////////////////////////////////////////////////////////////////
// Get Request
module.exports.get = function(req, res)
	{
	console.log("Request for the get page called!");

	// Unauthorized to make this request.
	// TODO

	// Get the parameters from the url.
	const visitId = req.query.visitId;
	const userId = req.query.userId;
	const searchString = req.query.searchString;

	// If the visitId is given.
	if(visitId)
		{
		// Find the user who has a purchaseHistory whose visitId is the same as the one the API was given.
		User.findOne( { 'purchaseHistory.visitId': visitId } )
			.then(user => {
				console.log('Found a purchase with this visitId!');

				// We have the whole user, but we need to find the purchase with the visitId now.
				for(let purchase of user.purchaseHistory)
					{
					if(purchase.visitId == visitId)
						{
						const thisPurchase = {
							userId: user.userId,
							locationName: purchase.locationName,
							visitId: purchase.visitId,
							date: purchase.date
							}
						
						// Send back an array containing just this purchase.
						res.status(200).send([thisPurchase]);
						return;
						}
					}	
				})
			.catch(err => {
				console.log('Error searching for the visitId in the DB.\n' + err);
				res.status(500).send({message: "Internal error, please try again."});
				return;
				});	
		}
	// If given the userId and searchString.
	else if(userId && searchString)
		{
		// Get this particular user.
		User.findOne( { userId: userId } )
			.then(user => {
				let matches = [];
				// We now have this user. We need to go through their purchase history and compare the search string to the location name.
				for(let purchase of user.purchaseHistory)
					{
					let location = purchase.locationName;

					// We need to compare if this location matches the one the user entered.
					// Use fuzzy string matching.
					const fuzz = require('fuzzball');

					// If we see > 60% likeness, consider it a match.
					if(fuzz.ratio(location, searchString) > 60)
						{
						const thisPurchase = {
							userId: user.userId,
							locationName: purchase.locationName,
							visitId: purchase.visitId,
							date: purchase.date
							}
						matches.push(thisPurchase);
						}
					}

				// Return the matches.
				res.status(200).send(matches);
				return;
				})
			.catch(err => {
				console.log('Error searching for the visitId in the DB.\n' + err);
				res.status(500).send({message: "Internal error, please try again."});
				return;
				});	
		}
	// If we don't have either of those, tell the user they didn't give enough info.
	else
		{
		const message = {
			message: "Invalid parameters. Please send userId and locationName."
			}
		res.status(400).send(message); // Bad request.
		return;
		}
	};
/////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////
// Post Request
module.exports.post = function(req, res)
	{
	console.log("Post request at /visit called.");

	// Get the parameters.
	const userId = req.body.userId;
	const name = req.body.locationName;

	// Check Authentication here.
	// TODO

	// If we don't have the right parameters, then return an error.
	if(!userId || !name)
		{
		const message = {
			message: "Invalid parameters. Please send userId and locationName."
			}
		res.status(400).send(message); // Bad request.
		return;
		}

	// Check if this user exists, by seeing if this userif is in the DB.
	User.findOne({ userId: userId })
		.then(user => {
			// If there is a user...
			if(user)
				{
				// Create an id for this visit.
				const mongoose = require('mongoose');
				const visitId = mongoose.Types.ObjectId();

				// Create this new visit for the array.
				const newVisit = {
					visitId: visitId,
					locationName: name
					}

				// Add this new visit to the purchase history. 
				user.purchaseHistory.push(newVisit);

				// Save this user with the changes. 
				user.save()
					.then(user =>
						{
						console.log("Successfully updated user.")
						res.send({
							message: "Success", 
							visitId: visitId,
							date: Date.Now
							});
						return;
						})
					.catch(err => 
						{
						console.log(`Error saving user: ${err}`);
						res.status(500).send({message: "Internal error, please try again."});
						});
				}
			// This user doesn't exist. Let's make one for them.
			else
				{
				console.log("This user doesn't exist, so we'll create it..");

				// Create an id for this visit.
				const mongoose = require('mongoose');
				const visitId = mongoose.Types.ObjectId();

				// The new User for the DB.
				const newUser = new User({
					userId: userId,
					purchaseHistory: [
							{	
							visitId: visitId,
							locationName: name
							}
						]
					});
				newUser.save()
					// Return success (Brad just returns user info) to the user.
					.then(user =>
						{
						console.log("Successfully created new user.")
						res.send({
							message: "Success", 
							visitId: visitId,
							date: Date.Now
							});
						return;
						})
					.catch(err => 
						{
						console.log(`Error saving user: ${err}`);
						res.status(500).send({message: "Internal error, please try again."});
						});
				}
			})
		.catch(err => 
			{
			console.log('Error searching the DB for the user.\n' + err);
			res.status(500).send({message: "Internal error, please try again."});
			});
	};
/////////////////////////////////////////////////////////////////////