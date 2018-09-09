'use strict';

const request = require('request');

/*
 * Function to turn JSON object to URL params
 */
function jsonToQueryString(json) {
    return '?' +
        Object
        .keys(json)
        .map(function (key) {
            if (json[key] !== null) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }
        })
        .join('&');
}

/*
 * Check for standard errors in the response object
 */
function checkResponseForErrors(res) {
    let { statusCode, body, headers } = res;

    if (statusCode >= 400) {
        return { error: true, body };
    }

    // API key is invalid
    if ((body.error) && (body.error === 'Unauthorized')) {
        return { error: true, body };
    }

    // response is not json
    if (headers['content-type'] !== 'application/json; charset=utf-8') {
        return { error: true, body: { error: 'JSON expected' } };
    }

    return { error: false, body };
}

class OmbiAPI {
    constructor(options) {
        // Gather constructor parameters
        this.hostname = options.hostname;
        this.port = options.port || 3579;
        this.apiKey = options.apiKey;
        this.urlBase = options.urlBase;
        this.ssl = options.ssl || false;
        this.username = options.username || null;
        this.auth = false;

        // `hostname` in valid
        if (!this.hostname) {
            throw new TypeError('Hostname is empty');
        }

        // Sanitize `hostname`
        this.hostname = this.hostname.replace(/^https?:\/\//, '');

        // Validate `port`
        if ((!this.port) || (typeof this.port !== 'number')) {
            try {
                this.port = parseInt(this.port);
            } catch (e) {
                throw new TypeError('Port is not a number');
            }
        }

        // Valid characters in API key
        if (this.apiKey.search(/[^a-z0-9]{32}/) !== -1) {
            throw new TypeError('API Key is an invalid');
        }

        // URL Base exists && is valid
        if ((this.urlBase) && (this.urlBase.charAt(0) !== '/')) {
            this.urlBase = '/' + this.urlBase;
        }

        // Construct the URL
        var serverUrl = 'http' + (this.ssl !== false ? 's' : '') + '://' + this.hostname + ':' + this.port;

        // Add in the base URL if present
        if (this.urlBase) {
            serverUrl = serverUrl + this.urlBase;
        }

        // Completed API URL
        this.serverApi = serverUrl + '/api/v1/';
    }

    /*
     * sends request to Ombi API
     */
    _request(actions) {
        function promiseRequest(options) {
            return new Promise((resolve, reject) => {
                request(options, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        let { error, body } = checkResponseForErrors(res);

                        if (error) {
                            reject(body);
                        } else {
                            resolve(body);
                        }
                    }
                })
            })
        }

        // Append the server URL, api, and relative url and - if GET params those too
        let apiUrl = this.serverApi + actions.relativeUrl;

        if ((actions.parameters) && (actions.method === 'GET')) {
            apiUrl = apiUrl + jsonToQueryString(actions.parameters);
        }

        // Build the HTTP request headers
        let headers = {
            'ApiKey': this.apiKey,
            'UserName': this.username
        };

        // Append the type
        if (actions.method === 'GET') {
            Object.assign(headers, {
                'Accept': 'application/json'
            });
        } else {
            Object.assign(headers, {
                'Content-Type': 'application/json'
            });
        }

        // Append auth to headers
        if (this.auth) {
            let buffer = new Buffer(this.username + ':' + this.password);

            Object.assign(headers, {
                'Authorization': 'Basic ' + buffer.toString('base64')
            });
        }

        // Request options
        let options = {
            'url': apiUrl,
            'headers': headers
        };

        // Usually we don't have valid ssl certs, so ignore it
        if (this.ssl) {
            Object.assign(options, {
                'strictSSL': false
            });
        }

        // Append the method parameter to the request
        Object.assign(options, {
            'method': actions.method
        });

        if (['POST', 'PUT', 'DELETE'].includes(actions.method)) {
            Object.assign(options, {
                'json': actions.parameters
            });
        } else {
            Object.assign(options, {
                'json': true
            });
        }

        // Issue request-promise and return

        return promiseRequest(options)
            .then(response => {
                console.log({"Options": options, "Response": response});
                return response;
            })
            .catch(e => {
                console.error({"Options": options, "Error": e.toString()});
                throw new Error(e.message);
            });
    }

    /*
     * Retrieve from API via GET
     */
    get(relativeUrl, parameters = {}) {
        // no Relative url was passed
        if (relativeUrl === undefined) {
            throw new TypeError('Relative URL is not set');
        }

        // parameters isn't an object
        if (typeof parameters !== 'object') {
            throw new TypeError('Parameters must be type object');
        }

        var actions = {
            'relativeUrl': relativeUrl,
            'method': 'GET',
            'parameters': parameters
        };

        return this._request(actions)
            .then(function (data) {
                return data;
            });
    }

    /*
     * Perform an action via POST
     */
    post(relativeUrl, parameters = {}) {
        // No Relative URL was passed
        if (relativeUrl === undefined) {
            throw new TypeError('Relative URL is not set');
        }

        // Paramet isn't an object
        if (typeof parameters !== 'object') {
            throw new TypeError('Parameters must be type object');
        }

        var actions = {
            'relativeUrl': relativeUrl,
            'method': 'POST',
            'parameters': parameters
        };

        return this._request(actions)
            .then(function (data) {
                return data;
            });
    }

    /*
     * perform an action via PUT
     */
    put(relativeUrl, parameters = {}) {
        // no Relative url was passed
        if (relativeUrl === undefined) {
            throw new TypeError('Relative URL is not set');
        }

        // parameters isn't an object
        if (typeof parameters !== 'object') {
            throw new TypeError('Parameters must be type object');
        }

        var actions = {
            'relativeUrl': relativeUrl,
            'method': 'PUT',
            'parameters': parameters
        };

        return this._request(actions)
            .then(function (data) {
                return data;
            });
    }

    /*
     * perform an action via PUT
     */
    delete(relativeUrl, parameters = {}) {
        // no Relative url was passed
        if (relativeUrl === undefined) {
            throw new TypeError('Relative URL is not set');
        }

        // parameters isn't an object
        if (typeof parameters !== 'object') {
            throw new TypeError('Parameters must be type object');
        }

        var actions = {
            'relativeUrl': relativeUrl,
            'method': 'DELETE',
            'parameters': parameters
        };

        return this._request(actions)
            .then(function (data) {
                return data;
            });
    }
}

module.exports = OmbiAPI;
