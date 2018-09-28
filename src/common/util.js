var appRoot = require('app-root-path');
const logger = require(appRoot + '/src/common/logger');
exports.sendFailure = function (res, req, httpCode, err) {
    var errorMessage = 'Exception: HTTP Code - ' + httpCode + ', Message - ' + err.stack;
    logApiError(errorMessage, req);
    res.sendStatus(httpCode).json({error: err.code, err_message: err.message});
};

function logApiError (message, req) {
    var logMessage = 'App Name: ABC Api' + ', Url: ' + req.originalUrl + ', Error Message: ' + message;
    logger.error(logMessage);
}