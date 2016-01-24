/* global Parse */
/* global _ */
var create = require('../configs/config-angular').createController;
exports.configure=(app)=>{
    app.controller('connect', create(connect));
};
var connect = 
    function($scope, parse, $stateParams, $timeout, $state, $rootScope){//injects
    var root = $rootScope;
    var vm = this;
    vm.model = {};
    vm.fields = [
        {
            key: 'email',
            type: 'input',
            templateOptions: {
                label: 'Email',
                placeholder: 'Email',
                required: true,
                type: 'email'
            }
        },
        {
            key: 'pass',
            type: 'input',
            templateOptions: {
                label: 'Password',
                placeholder: 'Password',
                required: true,
                type:'password'
            }
        }
    ];

    vm.disconnect=()=>{
        Parse.User.logOut().then(function(){
            root.goto('home');
        });  
    };

    $scope.onLogin = () => {
//        console.log(vm.model);
        Parse.User.logIn(vm.model.email, vm.model.pass).then(function () {
            $state.go('profile', {});
        }).fail(function (a) {
            $scope.warning = a.message;
            console.warn('error', a);
            $timeout(() => $scope.$apply());
        });
    };

    $scope.onRegister = () => {
        Parse.User.signUp(vm.model.email, vm.model.pass).then(function (a, b, c) {
            console.info(a, b, c);
        }).fail(function (a) {
            $scope.warning = a.message;
            console.warn('error', a);
            $timeout(() => $scope.$apply());
        });
    };

    $timeout(() => $scope.$apply(),2000);

};