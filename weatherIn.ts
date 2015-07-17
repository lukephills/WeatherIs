const Weather = require('./weather');
const Postcode = require('./postcode');

const FORCAST_API = '46ff9538f861be4285f68140b5097479';
const GOOGLEMAPS_API = '';

const weather = new Weather(FORCAST_API);
const postcode = new Postcode(GOOGLEMAPS_API);

const givenAddress: string[] | string = process.argv.slice(2).join(' ');


postcode.getLatLong(givenAddress, function(error, data) {

    if (error) throw (error);

    const googleData = {
        'latitude': data.results[0].geometry.location.lat,
        'longditude': data.results[0].geometry.location.lng,
        'address': data.results[0].formatted_address,
    };

    weather.forcast(googleData.latitude, googleData.longditude, (error, data) => {

        if (error) throw (error);

        const forcastData = data;
        const checkHoursAhead = 2; // How many hours to check ahead. Note 1 is the current hour

        let temperature = fahrenheitToCelcius(forcastData.hourly.data[checkHoursAhead].temperature);
        //to 1 decimal place
        temperature = Math.round(temperature * 10) / 10;
        let forcast = forcastData.hourly.data[checkHoursAhead].summary;

        let chanceOfRain = forcastData.hourly.data[checkHoursAhead].precipProbability * 100;
        let windspeed = Math.round(forcastData.hourly.data[checkHoursAhead].windSpeed * 10) / 10;

        // Is it too windy to play some ping pong?
        let pingpongText = '';
        if (windspeed > 11) {
            pingpongText += `It's too windy for outdoor ping pong normally, but EXTREME ping pong is the best.`;
        } else if (windspeed < 11 && windspeed > 7) {
            pingpongText += `Outdoor ping pong would be tricky, but could be done.`;
        } else {
            pingpongText += `Perfect for some outdoor ping pong!`;
        }

        console.log(`

In ${googleData.address}:

The temperature is ${temperature}° celsius.

The forcast is ${forcast} and there's a ${chanceOfRain}% chance of rain.

The windspeed is ${windspeed}mph. ${pingpongText}

        `);

    })

});


function fahrenheitToCelcius(n: number): number {
    return (n - 32) * .5556;
}


function rainAscii() {

}
