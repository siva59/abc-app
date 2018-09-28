const appRoot = require('app-root-path');
const constants = require( appRoot + '/src/config/constants');
const logger = require(appRoot + '/src/common/logger');
const instance = require(appRoot + '/src/common/apiClient').axiosAPIClientinstance;
const _ = require('lodash');

exports.getEmploymentInfo =  function (elem) {
  return new Promise((resolve, reject) => {
    var employments = { annual_salary: ""};
      instance.get(elem.employments.url)
      .then(function (response) {
        //TODO: I assume latest employments are at index zero
        employments.annual_salary = response.data.data.data[0].annual_salary;
      })
      .catch(function (error) {
        logger.warn(error);
        reject(error);
      })
      .then(function () {
        elem.employments.annual_salary = employments.annual_salary;
        //logger.info(elem);
        resolve(elem);
      });
  });
}
