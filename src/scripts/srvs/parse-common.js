/* global Parse */

var getQuery = (className) => {
    var C = Parse.Object.extend(className);
    return new Parse.Query(C);
};
var getAll = (className, fields, options) => {
    var Q = getQuery(className);
    return Q.select(fields).find();
};

var setDataToInstance = (instance, data) => {
    Object.keys(data).forEach(function (key) {
        instance.set(key, data[key]);
    });
    return instance;
};

var updateInstance = (className, data, instance) => {
    instance = instance || new Parse.Object(className, data);
    instance = setDataToInstance(instance, data);
    return instance;
};

var extractDataFromResult = (result, fields) => {
    var dataset = {};
    fields.forEach(function (key) {
        dataset[key] = result.get(key);
    });
    dataset.id = result.id;
    return dataset;
};

var extractDataFromResults = (result, fields) => {
    var data = [];
    result.forEach(function (item) {
        data.push(extractDataFromResult(item, fields));
    });
    return data;
};

var inject = (srv) => {
    Object.keys(METHODS).forEach((k) => {
        srv[k] = METHODS[k];
    });
    return srv;
};

var METHODS = {
    getQuery: getQuery,
    getAll: getAll,
    setDataToInstance: setDataToInstance,
    updateInstance: updateInstance,
    extractDataFromResult: extractDataFromResult,
    extractDataFromResults: extractDataFromResults,
    inject: inject
};
Object.keys(METHODS).forEach((k) => {
    exports[k] = METHODS[k];
});

