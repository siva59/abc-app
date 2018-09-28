const appRoot = require('app-root-path');
const logger = require(appRoot + '/src/common/logger');
const instance = require(appRoot + '/src/common/apiClient').axiosAPIClientInstanceWithBase;
const _ = require('lodash');
var mcache = require('memory-cache');

exports.getCompanies =  function () {
  return new Promise((resolve, reject) => {
    var company = {};
    let key = instance.baseURL + '/companies';
    var found = mcache.get(key);
    if(found){
      logger.info("from cache");
      resolve(mcache.get(key));
    }else{
      instance.get('/companies')
      .then(function (response) {
        company.id = response.data.data.data[0].id;
        company.name = response.data.data.data[0].name;
        company.legal_city =response.data.data.data[0].legal_city;
        company.legal_state = response.data.data.data[0].legal_state;
        company.people = response.data.data.data[0].people.url;
        company.locations= response.data.data.data[0].locations.url;
        company.departments = response.data.data.data[0].departments.url;
      })
      .catch(function (error) {
        logger.warn(error);
        reject(error);
      })
      .then(function () {
        mcache.put(key, company, 100000);
        resolve(company);
      });
    }
  });

}
