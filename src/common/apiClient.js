const axios = require('axios');
const appRoot = require('app-root-path');

const constants = require( appRoot + '/src/config/constants');

const axiosAPIClientInstanceWithBase = axios.create({
    baseURL: constants.baseURL,
    timeout: 10000,
    headers: {
        'Authorization': constants.accessToken
    }
});

const axiosAPIClientinstance = axios.create({
    timeout: 10000,
    headers: {
        'Authorization': constants.accessToken
    }
});

module.exports.axiosAPIClientinstance = axiosAPIClientinstance;
module.exports.axiosAPIClientInstanceWithBase= axiosAPIClientInstanceWithBase;