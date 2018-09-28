const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/common/logger');
const instance = require(appRoot + '/src/common/apiClient').axiosAPIClientinstance;
const _ = require('lodash');
var mcache = require('memory-cache');

exports.getDepartmentsInfo =  function (elem) {
  return new Promise((resolve, reject) => {
      var dept = { name: ""};
      var found = mcache.get(elem.department.url);
      if(found){
        logger.info("from cache");
        elem.department.name = mcache.get(elem.department.url);
        resolve(elem);
      }else{
        instance.get(elem.department.url)
        .then(function (response) {
          dept.name = response.data.data.name;
        })
        .catch(function (error) {
          logger.warn(error);
          reject(error);
        })
        .then(function () {
          if(!_.isNull(elem.department.url)){
            mcache.put(elem.department.url, dept.name, 100000);
          }
          elem.department.name = dept.name;
          //logger.info(elem);
          resolve(elem);
        });
      }
  });
}
