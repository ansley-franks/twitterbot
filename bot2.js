// Our Twitter library

const { maxHeaderSize } = require('http');
var Twit = require('twit');

// Include the configuration file
var T = new Twit(require('./config.js'));

// Prints our bot is starting 
console.log("Our bot is starting!");

// This is the URL of a search for the latest tweets on the '#mediaarts' hashtag.
var competitionSearch = {q: "#mildlyinfuriating", count: 10, result_type: "recent"};

// This function finds the latest tweet with the an alternating hashtag, and retweets it.
function retweetLatest() {
	T.get('search/tweets', competitionSearch, function (error, data) {
	// log out any errors and responses
	console.log(error, data);
	// If our search request to the server had no errors...
	if (!error) {
		// ...then we grab the ID of the tweet we want to retweet...
		var retweetId = data.statuses[0].id_str;
		// ...and then we tell Twitter we want to retweet it!
		T.post('statuses/retweet/' + retweetId, { }, function (error, response) {
			if (response) {
				console.log('Success! Check your bot, it should have retweeted something.')
			}
			// If there was an error with our Twitter call, we print it out here.
			if (error) {
				console.log('There was an error with Twitter:', error);
			}
		})
	}
	// However, if our original search request had an error, we want to print it out here.
	else {
	  	console.log('There was an error with your hashtag search:', error);
	}
	});
}

//Calls the retweetLatest function.
retweetLatest();
//Sets the interval for retweetLatest to sixty minutes.
setInterval(retweetLatest, 1000 * 60 * 60 * 60);


function postAngryPenguin() {
	var fs = require('fs');
	var b64content = fs.readFileSync('./images/angry_penguin2.jpeg', {encoding: 'base64'})
	

	var randomInt;
	function getRandomInteger(m) {
		randomInt = Math.floor(Math.random() * m);
	}

	var params = {
		q: "mildlyinfuriating",
		//count:200
	}

	var outerTweet;

	function gotData(err, data, response) {
		var tweets = data.statuses;
		for (var i = 0; i < tweets.length; i++) {
			console.log(tweets[i].text);
		}

		while (outerTweet == undefined) {
			randomInt = getRandomInteger(tweets.length);
			if (tweets[randomInt].text != undefined) {
				outerTweet = tweets[randomInt].text;	
			}
		}

	}

	T.post('media/upload', {media_data: b64content}, function(err, data, response) {
		var mediaIdStr = data.media_id_string
		var altText = "Angryyy penguin"
		var meta_params = {media_id: mediaIdStr, alt_text: {text: altText }}

		T.post('media/metadata/create', meta_params, function(err, data, response) {
			if (!err) {
				if (outerTweet != undefined) {
					var params = {status: "you: " + outerTweet.toUpperCase() + "\nme:", media_ids: [mediaIdStr]}
				}
				

				T.post('statuses/update', params, function(err, data, response) {
					console.log(data)
				})
			}
		})
	})
}
//Calls the postAngryPenguin function.
postAngryPenguin();
//Sets the interval for postAngryPenguin to sixty minutes.
setInterval(postAngryPenguin, 1000 * 60 * 60 * 60);


