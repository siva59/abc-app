const appRoot = require('app-root-path');
const constants = require( appRoot + '/src/config/constants');
const logger = require(appRoot + '/src/common/logger');
const instance = require(appRoot + '/src/common/apiClient').axiosAPIClientinstance;
const _ = require('lodash');
var m2cache = require('memory-cache');

function skimmedObject(elem){
  return _.pick(elem, ['id', 'first_name', 'last_name', 'middle_name', 'title','work_email',
               'employments.url', 'manager.url', 'location.url', 'department.url' ]);
}

function getPeopleManagerInfo(elem){
    return new Promise((resolve, reject) => {
        var manager = { first_name:"", last_name:""};
        var found = m2cache.get(elem.manager.url);
        if(found){
          logger.info("from cache");
          elem.manager = m2cache.get(elem);
          resolve(elem);
        }else{
          instance.get(elem.manager.url)
          .then(function (response) {
            manager = _.pick(response.data.data, ['first_name','last_name'] );
          })
          .catch(function (error) {
            logger.warn(error);
            reject(error);
          })
          .then(function () {
            if(!_.isNull(elem.manager.url)){
              m2cache.put(elem.manager.url, manager, 10000);
            }
            elem.manager = manager;
            resolve(elem);
          });
        }
      });
}

function getCompanyPeopleInfo(companyPeopleURL, startAfter, pageSize) {
  return new Promise((resolve, reject) => {
    var employees = {};
    var url = companyPeopleURL + '?starting_after='+ startAfter +'&limit=' + pageSize;
    logger.info("people url=" + url);
    instance.get(url)
    .then(function (response) {
      employees = _.map(response.data.data.data, skimmedObject);
    })
    .catch(function (error) {
      logger.warn("getCompanyPeopleInfo: " + error);
      reject(error);
    })
    .then(function () {
      //logger.info(employees);
      resolve(employees);
    });
  });
}

function clearCache() {
  m2cache.clear();
}

exports.getCompanyPeopleInfo = getCompanyPeopleInfo;
exports.getPeopleManagerInfo = getPeopleManagerInfo;
exports.clearCache = clearCache;