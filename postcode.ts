var https: any = require('https');
var util = require('util');

class Postcode {

    private _postCode: string;
    private _api: string;

    constructor(api) {
        this._api = api;
    }

    getLatLong(address: string, callback: Function) {
        address = encodeURI(address)

        const request = https.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}`, (response) => {

            let data = '';

            response.on('error', (error) => {
                return callback(error);
            });

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                if (response.statusCode == 200) {
                    try {
                        const parsedData = JSON.parse(data);

                        if (parsedData.results.length){
                            return callback(null, parsedData);
                        } else {
                            return callback(`Retrieved no results`, parsedData);
                        }

                    } catch (error) {
                        this.printError(error);
                    }
                } else {
                    this.printError({
                        message: "There was an error getting location from the postcode: " +
                                 address + ". ( Status Code: " + response.statusCode + ' - ' + https.STATUS_CODES[response.statusCode] + " )."
                    });
                }

            });

        });

    }

    printError(error) {
        console.error(error.message);
    }
}

export = Postcode;
