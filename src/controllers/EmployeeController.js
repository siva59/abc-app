const appRoot = require('app-root-path');
const axios = require('axios');
const _ = require('lodash');
var constants = require(appRoot + '/src/config/constants');
const util = require(appRoot + '/src/common/util');
const people = require(appRoot + '/src/models/People');
const companies = require(appRoot + '/src/models/Companies');
const departments = require(appRoot + '/src/models/Departments');
const locations = require(appRoot + '/src/models/Locations');
const employments = require(appRoot + '/src/models/Employments');
var express = require('express');
var router = express.Router();
var companyInfo = { people: 'https://api.zenefits.com/core/companies/159815/people'};
const logger = require(appRoot + '/src/common/logger');

function getEmployessInfo(req,res) {
    var startAfter = _.toNumber(req.query.start_after);
    var pageSize = _.toNumber(req.query.page_size);

    people.getCompanyPeopleInfo(companyInfo.people, startAfter, pageSize).then(function(resPeople){
        let employees = [];
        var mapEmployees = {};
        let promises = [];

        _.forEach(resPeople, function(elem){
            if(_.has(elem, 'department.url') && !_.isNull(elem.department.url)){
                promises.push(departments.getDepartmentsInfo(elem));
            }else{
                elem.department.name = "";
            }

            if(_.has(elem, 'location.url') && !_.isNull(elem.location.url)){
                promises.push(locations.getLocationInfo(elem));
            }else{
                elem.location.name="";
            }

            if(_.has(elem, 'manager.url') && !_.isNull(elem.manager.url)){
                promises.push(people.getPeopleManagerInfo(elem));
            }else{
                elem.manager.first_name="";
                elem.manager.last_name="";
            }

            if(_.has(elem, 'employments.url') && !_.isNull(elem.employments.url)){
                promises.push(employments.getEmploymentInfo(elem));
            }else{
                elem.employments.annual_salary = "";
            }
        });

        axios
        .all(promises)
        .then(axios.spread((...args) => {
            for (let i = 0; i < args.length; i++) {
                mapEmployees[args[i].id] = args[i];
            }
        }))
        .then(function(resp){
            for(var entry in mapEmployees){
                employees.push(mapEmployees[entry]);
            }
            res.json(employees);
        });
    })
    .catch(function (error) {
        err = new Error(constants.messages.INTERNAL_SERVER_ERROR);
        util.sendFailure(res, req, constants.type.INTERNAL_SERVER_ERROR_CODE, err);
    });
}


function getCompanyInfo(req,res, next) {
    logger.info("Companies");
    companies.getCompanies()
    .then(function(resCompany){
        companyInfo=resCompany;
        //res.json(companyInfo);
        next();
    })
    .catch(function (error) {
        err = new Error(constants.messages.INTERNAL_SERVER_ERROR);
        util.sendFailure(res, req, constants.type.INTERNAL_SERVER_ERROR_CODE, err);
    });
}

function clearAllCache(){
    require(appRoot + '/src/models/People').clearCache();
    require(appRoot + '/src/models/Locations').clearCache();
}

router.get('*', getCompanyInfo);
router.get('/employees', getEmployessInfo);

module.exports = router;