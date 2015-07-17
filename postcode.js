var https = require('https');
var util = require('util');
var Postcode = (function () {
    function Postcode(api) {
        this._api = api;
    }
    Postcode.prototype.getLatLong = function (address, callback) {
        var _this = this;
        address = encodeURI(address);
        var request = https.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + address, function (response) {
            var data = '';
            response.on('error', function (error) {
                return callback(error);
            });
            response.on('data', function (chunk) {
                data += chunk;
            });
            response.on('end', function () {
                if (response.statusCode == 200) {
                    try {
                        var parsedData = JSON.parse(data);
                        if (parsedData.results.length) {
                            return callback(null, parsedData);
                        }
                        else {
                            return callback("Retrieved no results", parsedData);
                        }
                    }
                    catch (error) {
                        _this.printError(error);
                    }
                }
                else {
                    _this.printError({
                        message: "There was an error getting location from the postcode: " +
                            address + ". ( Status Code: " + response.statusCode + ' - ' + https.STATUS_CODES[response.statusCode] + " )."
                    });
                }
            });
        });
    };
    Postcode.prototype.printError = function (error) {
        console.error(error.message);
    };
    return Postcode;
})();
module.exports = Postcode;
