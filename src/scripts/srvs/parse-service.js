/* global Parse */


var keys = require('../configs/config-parse').keys;
var injectServicity = require('./parse-servicity').inject;
var injectCommon = require('./parse-common').inject;
var getQuery = require('./parse-common').getQuery;
var setDataToInstance = require('./parse-common').setDataToInstance;
var updateInstance = require('./parse-common').updateInstance;

Parse.initialize(keys.applicationId, keys.javaScriptKey, keys.masterKey);


exports.Service = function () {
    var srv =  {
        Parse: Parse,
        Query: getQuery,
        Data: (result, fields) => {
            var data = [];
            var dataset = {};
            result.forEach(function (item) {
                dataset = {};
                fields.forEach(function (key) {
                    dataset[key] = item.get(key);
                });
                dataset.id = item.id;
                data.push(dataset);
            });
            return data;
        },
        SetData: setDataToInstance,
        Instance: updateInstance
    };

    srv = injectCommon(srv);
    srv = injectServicity(srv);    
    return srv;
};