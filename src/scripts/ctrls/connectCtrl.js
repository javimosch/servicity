/* global _ */

exports.ctrl = ['$scope', 'parseSrv', '$stateParams', '$timeout', '$state', function ($scope, sparse, $stateParams, $timeout, $state) {


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



    $scope.onLogin = () => {
//        console.log(vm.model);
        sparse.Parse.User.logIn(vm.model.email, vm.model.pass).then(function () {
            $state.go('profile', {});
        }).fail(function (a) {
            $scope.warning = a.message;
            console.warn('error', a);
            $timeout(() => $scope.$apply());
        });
    };

    $scope.onRegister = () => {
        sparse.Parse.User.signUp(vm.model.email, vm.model.pass).then(function (a, b, c) {
            console.info(a, b, c);
        }).fail(function (a) {
            $scope.warning = a.message;
            console.warn('error', a);
            $timeout(() => $scope.$apply());
        });
    };



}];