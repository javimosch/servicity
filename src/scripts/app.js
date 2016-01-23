/* global angular */

var routeConfiguration = require('./configs/config-angular').routeConfiguration;

var serviceCtrl = require('./ctrls/serviceCtrl').mainCtrl;
var serviceEditCtrl = require('./ctrls/serviceCtrl').editCtrl;
var servicesCtrl = require('./ctrls/serviceCtrl').listCtrl;
var connectCtrl = require('./ctrls/connectCtrl').ctrl;
var configureProfileModule = require('./ctrls/profile-ctrl').configure;
var configureFormly = require('./configs/config-formly').configure;
var parseSrv = require('./srvs/parseSrv').Service;

(function () {
    console.log('app');
    var app = angular.module('app', ['ngResource', 'ui.router', 'formly', 'formlyBootstrap','ui.bootstrap','ngMessages']);
    
    app.config(routeConfiguration);//configuration
    configureFormly(app); //configuration
    configureProfileModule(app);//controller
    app.service('parseSrv',parseSrv); //service
    app.controller('appCtrl', require('./ctrls/appCtrl').ctrl); //controller
    app.controller('serviceCtrl', serviceCtrl);//controller
    app.controller('serviceEditCtrl', serviceEditCtrl);//controller
    app.controller('servicesCtrl', servicesCtrl);//controller
    app.controller('connectCtrl',connectCtrl);//controller
})();