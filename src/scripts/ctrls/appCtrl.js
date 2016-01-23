exports.ctrl = ['$scope', '$rootScope', '$state', 'parseSrv', '$timeout', function ($scope, root, $state, parseSrv, $timeout) {
    console.log('appCtrl');




    root.goto = (name, params) => {
        $state.go(name, params);
    };

    root.statusLogged = () => {
        return parseSrv.Parse.User.current() && parseSrv.Parse.User.current().authenticated();
    }

    root.state = {
        saving: false,
        success: '',
        warning: ''
    };

    root.toggleState = (stateVarName, val, nextVal, timeout) => {
        root.state[stateVarName] = val;
        if(nextVal === undefined && timeout === undefined) return;
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

}];