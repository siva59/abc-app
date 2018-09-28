'use strict';
var Cache = require('memory-cache').Cache;

var cache = null;

exports.getCacheInstance = function(){
    if(global.cache === undefined){
        global.cache = new Cache();
    }
    return global.cache;
}