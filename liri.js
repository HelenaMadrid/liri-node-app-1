require("dotenv").config();

var axios = require("axios");
var moment = require('moment');

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var type = process.argv[2];
var value = process.argv[3];

switch (type) {
    case "concert-this":
        concertInfo();
        break;
    case "spotify-this-song":
        spotifyInfo();
        break;
    case "movie-this":
        movieInfo();
        break;
}

function concertInfo() {
    axios.get("https://rest.bandsintown.com/artists/" + value + "/events?app_id=codingbootcamp")
        .then(function (response) {
            printBandData(response.data)
        })
        .catch(function (error) {
            console.log(error);
        });
}

function spotifyInfo() {
    
    if(value == undefined){
        value = "The Sign - Ace of base";
    }

    spotify.search({ type: 'track', query: value }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        printSpotifyData(data);
    });
}

function movieInfo() {
    
    if(value == undefined){
        value = "Mr. Nobody";
    }

    axios.get("http://www.omdbapi.com/?apikey=trilogy&t=" + value)
        .then(function (response) {
            printMovieInfo(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
}

function printBandData(data) {

    for (let i = 0; i < data.length; i++) {
        var name = data[i].venue.name;
        var location = data[i].venue.city + ", " + data[i].venue.country;
        var date = moment(data[i].datetime).format("MM-DD-YYYY");

        console.log("Name: " + name
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

function printMovieInfo(data){
    var title = data.Title;
    var year = data.Year;
    var rateIMDB = data.imdbRating;
    var rateRotten;
    var country = data.Country;
    var language = data.Language;
    var plot = data.Plot;
    var actors = data.Actors;

    for (let index = 0; index < data.Ratings.length; index++) {
        if(data.Ratings[index].Source == "Rotten Tomatoes"){
            rateRotten = data.Ratings[index].Value;
            break;
        }else{
            rateRotten = "Rating not available."
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