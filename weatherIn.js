var Weather = require('./weather');
var Postcode = require('./postcode');
var FORCAST_API = '46ff9538f861be4285f68140b5097479';
var GOOGLEMAPS_API = '';
var weather = new Weather(FORCAST_API);
var postcode = new Postcode(GOOGLEMAPS_API);
var givenAddress = process.argv.slice(2).join(' ');
postcode.getLatLong(givenAddress, function (error, data) {
    if (error)
        throw (error);
    var googleData = {
        'latitude': data.results[0].geometry.location.lat,
        'longditude': data.results[0].geometry.location.lng,
        'address': data.results[0].formatted_address,
    };
    weather.forcast(googleData.latitude, googleData.longditude, function (error, data) {
        if (error)
            throw (error);
        var forcastData = data;
        var checkHoursAhead = 2;
        var temperature = fahrenheitToCelcius(forcastData.hourly.data[checkHoursAhead].temperature);
        temperature = Math.round(temperature * 10) / 10;
        var forcast = forcastData.hourly.data[checkHoursAhead].summary;
        var chanceOfRain = forcastData.hourly.data[checkHoursAhead].precipProbability * 100;
        var windspeed = Math.round(forcastData.hourly.data[checkHoursAhead].windSpeed * 10) / 10;
        var pingpongText = '';
        if (windspeed > 11) {
            pingpongText += "It's too windy for outdoor ping pong normally, but EXTREME ping pong is the best.";
        }
        else if (windspeed < 11 && windspeed > 7) {
            pingpongText += "Outdoor ping pong would be tricky, but could be done.";
        }
        else {
            pingpongText += "Perfect for some outdoor ping pong!";
        }
        console.log("\n\nIn " + googleData.address + ":\n\nThe temperature is " + temperature + "\u00B0 celsius.\n\nThe forcast is " + forcast + " and there's a " + chanceOfRain + "% chance of rain.\n\nThe windspeed is " + windspeed + "mph. " + pingpongText + "\n\n        ");
    });
});
function fahrenheitToCelcius(n) {
    return (n - 32) * .5556;
}
function rainAscii() {
}
