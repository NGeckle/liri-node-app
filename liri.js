require("dotenv").config();
var keys = require("./keys.js");
var twitter = require("twitter");
// var spotify = require("spotify"); //Doesn't work
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var first = process.argv[2];
var second = process.argv[3];
for (var i = 4; i < process.argv.length; i++) {
    second += '+' + process.argv[i];
}


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

function tweets() {
    var client = new twitter(keys.twitter);
    var params = {
        screen_name: 'nathan_geckle',
        count: 20
    };
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

function spot() {
    var spotify = new Spotify(keys.spotify);
    var searchSong;
    if (second === undefined) {
        searchSong = "The Sign";
    }
    else {
        searchSong = second;
    }
    spotify.search({type: 'track', query: searchSong}, function(err, data) {
        if (!err) {
            console.log(`Song: ${data.tracks.items[0].name}`);
            console.log(`Artist: ${data.tracks.items[0].artists[0].name}`);
            console.log(`Album: ${data.tracks.items[0].album.name}`);
            console.log(`Preview Link: ${data.tracks.items[0].preview_url}`);
        }
    });
}

function movie() {
    var searchMovie;
    if (second === '') {
        searchMovie = "Mr. Nobody";
    }
    else {
        searchMovie = second;
    }
    var movieUrl = "http://www.omdbapi.com/?t=" + searchMovie + "&y=&plot=long&tomatoes=true&r=json&apikey=90074f3";
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

calls();