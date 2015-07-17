var https = require('https');
var Weather = (function () {
    function Weather(api_key) {
        this._api_key = api_key;
    }
    Weather.prototype.forcast = function (lat, long, callback) {
        var _this = this;
        var request = https.get('https://api.forecast.io/forecast/' + this._api_key + '/' + lat.toString() + ',' + long.toString(), function (response) {
            var data = '';
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                if (response.statusCode == 200) {
                    try {
                        var parsedData = JSON.parse(data);
                        return callback(null, parsedData);
                    }
                    catch (error) {
                        _this.printError(error);
                    }
                }
                else {
                    _this.printError({
                        message: "There was an error getting the weather for latitude: " +
                            lat + ", longditude: " + long +
                            ". ( Status Code: " + response.statusCode + ' - ' + https.STATUS_CODES[response.statusCode] + " )."
                    });
                }
            });
        });
        request.on("error", this.printError);
    };
    Weather.prototype.printError = function (error) {
        console.error(error.message);
    };
    return Weather;
})();
module.exports = Weather;
