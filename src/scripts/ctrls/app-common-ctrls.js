/* global Parse */
var create = require('../configs/config-angular').createController;
exports.configure = (app) => {
    app.controller('main', create(main));
};

var main = 
  function($scope, parse, $stateParams, $timeout, $state, $rootScope){//injects
    var root = $rootScope;

    root.goto = (name, params) => {
        //console.info('goto ',name,params);
        $state.go(name, params);
    };

    root.statusLogged = () => {
        return Parse.User.current() && Parse.User.current().authenticated();
    }

    root.state = {
        saving: false,
        success: '',
        warning: ''
    };

    root.toggleState = (stateVarName, val, nextVal, timeout) => {
        root.state[stateVarName] = val;
        if(nextVal === undefined && timeout === undefined) return;
        if(timeout < 500) timeout = 500;
        $timeout(() => { root.$apply(); });
        $timeout(() => {
            nextVal = (nextVal == undefined) ? root.state[stateVarName] : nextVal;
            root.state[stateVarName] = nextVal;
            root.$apply();
        }, timeout);
    }

    root.stateName = () => {
        return $state.current.name;
    };


    root.question = (msg) => {
        return window.confirm(msg);
    };
    
    root.currentUser = ()=>{
      return Parse.User.current()  
    };

};