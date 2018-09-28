const appRoot = require('app-root-path');
const constants = require( appRoot + '/src/config/constants');
const logger = require(appRoot + '/src/common/logger');
const instance = require(appRoot + '/src/common/apiClient').axiosAPIClientinstance;
const _ = require('lodash');
var mcache = require('memory-cache');

exports.getLocationInfo =  function (elem) {
  return new Promise((resolve, reject) => {
    var location = { name: ""};
    var found = mcache.get(elem.location.url);
    if(found){
      logger.info("from cache");
      elem.location.name = mcache.get(elem.location.url);
      resolve(elem);
    }else{
      instance.get(elem.location.url)
      .then(function (response) {
        location.name = response.data.data.name;
      })
      .catch(function (error) {
        logger.warn(error);
        reject(error);
      })
      .then(function () {
        if(!_.isNull(elem.location.url)){
          mcache.put(elem.location.url, elem.location.name, 100000);
        }
        elem.location.name = location.name;
        resolve(elem);
      });
    }
  });
}

exports.clearCache = function() {
  mcache.clear();
}
