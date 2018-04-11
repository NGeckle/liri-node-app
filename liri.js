//Require stuff
require("dotenv").config();
var keys = require("./keys.js");
var twitter = require("twitter");
// var spotify = require("spotify"); //Doesn't work
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Arguments. The for loop is for every argument from 4 onwards
var first = process.argv[2];
var second = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
    second += '+' + process.argv[i];
}

//Argument calls
function calls() {
    if (first === "my-tweets") {
        tweets();
    }

    if (first === "spotify-this-song") {
        spot();
    }

    if (first === "movie-this") {
        movie();
    }

    if (first === "do-what-it-says") {
        doIt();
    }
}

//My tweets function
function tweets() {
    //Accesses keys
    var client = new twitter(keys.twitter);
    //Accesses my screen name and up to 20 tweets
    var params = {
        screen_name: 'nathan_geckle',
        count: 20
    };
    //Displays tweets
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var j = 0; j < tweets.length; j++) {
                var display = ('Tweet ' + (j + 1) + ': ' + tweets[j].created_at + ' ' + tweets[j].text);
                console.log(display);
            }
        }
        if (error) throw error;
    });
}

//Spotify function
function spot() {
    //Accesses keys
    var spotify = new Spotify(keys.spotify);
    //Variable for what the user puts as the search item
    var searchSong;
    //If there isn't anything typed in, searches "The Sign"
    if (second === '') {
        searchSong = "The Sign";
    }
    else {
        searchSong = second;
    }
    //Displays the song name, artist, album, and a preview link
    spotify.search({type: 'track', query: searchSong}, function(err, data) {
        if (!err) {
            console.log(`Song: ${data.tracks.items[0].name}`);
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log(`Preview Link: ${data.tracks.items[0].preview_url}`);
        }
    });
}

//Movie function
function movie() {
    //Variable for what the users puts as the search item
    var searchMovie;
    //If there isn't anything typed in, search "Mr. Nobody"
    if (second === '') {
        searchMovie = "Mr. Nobody";
    }
    else {
        searchMovie = second;
    }
    //Url to search the movie at
    var movieUrl = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=long&tomatoes=true&r=json&apikey=90074f3";
    //Uses request to display title, year, ratings, country, languages, plot, and actors
    request(movieUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).tomatoRating);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}

//Function that does what the text file says
function doIt() {
    fs.readFile("random.txt", "utf8", function(error, data) {
	    if (error) {
     		console.log(error);
        }
        else {
            var dataArr = data.split(',');
            first = dataArr[0];
            second = dataArr[1];
            for (var k = 2; k < dataArr.length; k++){
                second += "+" + dataArr[k];
            }
            calls();
        }
    });
}

//Runs the calls
calls();