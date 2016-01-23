/* global Parse */
var keys = require('../configs/config-parse').keys;

Parse.initialize(keys.applicationId, keys.javaScriptKey, keys.masterKey);

exports.Service = function () {
    function setData(instance, data) {
        Object.keys(data).forEach(function (key) {
            instance.set(key, data[key]);
           // console.log('setting', key, data[key]);
        });
        return instance;
    }
    return {
        Parse: Parse,
        Query: function (className) {
            var Class = Parse.Object.extend(className);
            var query = new Parse.Query(Class);
            return query;
        },
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
        SetData: setData,
        Instance: (className, data, instance) => {
            instance = instance || new Parse.Object(className, data);
            instance = setData(instance, data);
            return instance;
        }
    };
};