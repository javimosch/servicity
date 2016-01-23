/* global angular */

var configureAngular = require('./configs/config-angular').configure;
var configureFormly = require('./configs/config-formly').configure;

var configureAppModule = require('./ctrls/app-common-ctrls').configure;
var configureServiceModule = require('./ctrls/service-ctrls').configure;
var configureConnectModule = require('./ctrls/connect-ctrls').configure;
var configureProfileModule = require('./ctrls/profile-ctrls').configure;

var parse = require('./srvs/parse-service').Service;

var app = angular.module('app', ['ngResource', 'ui.router', 'formly', 'formlyBootstrap', 'ui.bootstrap', 'ngMessages']);

configureAngular(app);//configuration
configureFormly(app); //configuration
    
configureAppModule(app);//controller
configureProfileModule(app);//controller
configureServiceModule(app);//controller
configureConnectModule(app);//controller
  
app.service('parse', parse); //service
    
