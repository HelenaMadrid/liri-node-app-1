
/*---------------------------------------------------*/
/*	REQUIRED LIBRARIES
/*---------------------------------------------------*/

require("dotenv").config();
var fs = require("fs");

var axios = require("axios");
var moment = require('moment');

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var type = process.argv[2];
var value = process.argv[3];

/*---------------------------------------------------*/
/*	CODE FUNCTIONALITY
/*---------------------------------------------------*/

processCommand(type, value);

function processCommand(commandToExecute, valueToExecute) {
    switch (commandToExecute) {
        case "concert-this":
            concertInfo(valueToExecute);
            break;
        case "spotify-this-song":
            spotifyInfo(valueToExecute);
            break;
        case "movie-this":
            movieInfo(valueToExecute);
            break;
        case "do-what-it-says":
            readFile("random.txt");
            break;
    }
}

function concertInfo(valueToExecute) {
    axios.get("https://rest.bandsintown.com/artists/" + valueToExecute + "/events?app_id=codingbootcamp")
        .then(function (response) {
            printBandData(response.data, valueToExecute)
        })
        .catch(function (error) {
            console.log(error);
        });
}

function spotifyInfo(valueToExecute) {

    if (valueToExecute == undefined) {
        valueToExecute = "The Sign - Ace of base";
    }

    spotify.search({ type: 'track', query: valueToExecute }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        printSpotifyData(data);
    });
}

function movieInfo(valueToExecute) {

    if (valueToExecute == undefined) {
        valueToExecute = "Mr. Nobody";
    }

    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + valueToExecute)
        .then(function (response) {
            // printMovieInfo(response.data);
            console.log(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function printBandData(data, searchValue) {

    for (let i = 0; i < data.length; i++) {
        var search = searchValue;
        var name = data[i].venue.name;
        var location = data[i].venue.city + ", " + data[i].venue.country;
        var date = moment(data[i].datetime).format("MM-DD-YYYY");

        console.log("Search: " + search
            + "\nName: " + name
            + "\nLocation: " + location
            + "\nDate: " + date);
        console.log("------------------------------");
    }
}

function printSpotifyData(data) {

    for (let i = 0; i < data.tracks.items.length; i++) {
        var artist = data.tracks.items[i].artists[0].name;
        var song = data.tracks.items[i].name;
        var album = data.tracks.items[i].album.name;
        var preview = data.tracks.items[i].preview_url;

        if (preview == null) {
            preview = "No preview available."
        }

        console.log("Artist: " + artist
            + "\nSong: " + song
            + "\nAlbum: " + album
            + "\nPreview: " + preview);
        console.log("------------------------------");
    }
}

function printMovieInfo(data) {
    var title = data.Title;
    var year = data.Year;
    var rateIMDB = data.imdbRating;
    var rateRotten;
    var country = data.Country;
    var language = data.Language;
    var plot = data.Plot;
    var actors = data.Actors;

    for (let index = 0; index < data.Ratings.length; index++) {
        if (data.Ratings[index].Source == "Rotten Tomatoes") {
            rateRotten = data.Ratings[index].Value;
            break;
        } else {
            rateRotten = "Not available."
        }
    }

    console.log("Title: " + title
        + "\nYear: " + year
        + "\nIMDB Rating: " + rateIMDB
        + "\nRotten Tomatoes Rating: " + rateRotten
        + "\nCountry: " + country
        + "\nLanguage: " + language
        + "\nPlot: " + plot
        + "\nActors: " + actors);
    console.log("------------------------------");
}

function readFile(filename) {
    fs.readFile(filename, "utf8", function (error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        processCommand(dataArr[0], dataArr[1]);

    }
    )
}