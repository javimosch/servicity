/* global _ */
var routeConfiguration = require('./config-angular-routes').routesConfiguration;

exports.configure = (app) => {
    app.config(routeConfiguration);
};

//PARAMS
//($scope, parse, $stateParams, $timeout, $state, $rootScope)=>{}
var injectables = ['$scope', 'parse', '$stateParams', '$timeout', '$state', '$rootScope'];
exports.createController = (handler) => {
    var rta = _.clone(injectables);
    rta.push(handler);
    return rta;
};