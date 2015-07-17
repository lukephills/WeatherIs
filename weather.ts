var https: any = require('https');


class Weather {

    private _api_key: string;

    constructor(api_key) {
        this._api_key = api_key;
    }

    forcast(lat: number, long: number, callback: Function) {
        const request = https.get('https://api.forecast.io/forecast/' + this._api_key + '/'+ lat.toString() +',' + long.toString(), (response) => {
            let data = '';

            response.on('data', (chunk) => {
                    data += chunk;
            });

            response.on('end',  () => {
                if (response.statusCode == 200) {
                    try {
                        //Parse JSON here
                        const parsedData = JSON.parse(data);

                        return callback(null, parsedData)

                    } catch(error) {
                        this.printError(error);
                    }
                } else {
                    this.printError({
                        message: "There was an error getting the weather for latitude: " +
                                 lat + ", longditude: " + long +
                                 ". ( Status Code: " + response.statusCode + ' - ' + https.STATUS_CODES[response.statusCode] + " )."
                    });
                }

            })
        });

        request.on("error", this.printError);
    }

    printError(error) {
        console.error(error.message);
    }

}

export = Weather;
