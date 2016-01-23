/* global _ */

exports.configure = (app) => {
    app.controller('profileGeneral', general);
    app.controller('profileDetails', details);
    app.controller('profileServices', services);
};


var services = ['$scope', 'parseSrv', '$stateParams', '$timeout', '$state', '$rootScope', function ($scope, parseSrv, $stateParams, $timeout, $state, $rootScope) {
    var c = this;
    c.active = 0;
    c.services = [
        {
            description: 'Web design'
        },
        {
            description: 'Programming'
        }
    ];
    c.select = (index) => {
        if (index.toString() === '+1') {
            c.active++;
        } else if (index.toString() === '-1') {
            c.active--;
        } else {
            c.active = index;
        }
    };
}];


var general = ['$scope', 'parseSrv', '$stateParams', '$timeout', '$state', '$rootScope', function ($scope, parseSrv, $stateParams, $timeout, $state, $rootScope) {
    var c = this;
    c.user = parseSrv.Parse.User.current();
    c.model = parseSrv.Data([c.user], ['nick'])[0];
    setInterval(function () {
        var data = parseSrv.Data([c.user], ['nick'])[0];
        if (_.differenceWith([data], [c.model], _.isEqual).length !== 0) {
            $rootScope.toggleState('saving', 'Saving..', '', 9999);
            $timeout(() => $scope.$apply());
            parseSrv.Instance('User', c.model, c.user).save().then(function () {
                $timeout(() => {
                    $rootScope.toggleState('saving', '', '', 0);
                    $scope.$apply()
                }, 500);
            });
        }
    }, 2000);
}];


var details = ['$scope', 'parseSrv', '$stateParams', '$timeout', '$state', '$rootScope', function ($scope, parseSrv, $stateParams, $timeout, $state, $rootScope) {
    var root = $rootScope;
    var Parse = parseSrv.Parse;
    var vm = this;
    vm.model = {};
    vm.fields = [
        {
            key: 'firstName',
            type: 'input',
            templateOptions: {
                label: 'First Name',
                type: 'text',
                required: false
            }
        },
        {
            key: 'lastName',
            type: 'input',
            templateOptions: {
                label: 'Last Name',
                type: 'text',
                required: false
            }
        },
        {
            template:"<hr/>"
        },
        {
            key: 'email',
            type: 'input',
            templateOptions: {
                label: 'Email',
                type: 'email',
                required: true,
                placeholder: 'example@example.com'
            }
        },
        {
            key: 'password',
            type: 'input',
            templateOptions: {
                label: 'Password',
                placeholder: 'Password',
                required: true,
                type: 'password',
                value: '123456'
            }
        }
    ];

    Parse.User.current().fetch().then((r) => {
        vm.model = Object.assign(parseSrv.Data([r], ['username', 'email'])[0], {
            password: '123456'
        });
        vm.original = _.clone(vm.model);
    });

    vm.changed = () => {
        if (!vm.original) return false;
        return _.differenceWith([vm.original], [vm.model], _.isEqual).length !== 0;
    };

    vm.save = () => {
        console.log('save');
        if (vm.original.password !== vm.model.password) {
            if(root.question("If you change the password you will need to re-login using the new password right after press 'OK'")){
                changePassword(vm.model.password);    
            }
        } 
        
        $rootScope.toggleState('saving', 'Saving..');
        parseSrv.Instance('User',vm.model,parseSrv.Parse.User.current()).save().then(()=>{
            $rootScope.toggleState('saving', '');
            $rootScope.toggleState('success', 'Saved !', '', 2000);
        });
    }

    function changePassword(password) {
        Parse.User.current().setPassword(password);
        $rootScope.toggleState('saving', 'Saving..', '', 9999);
        Parse.User.current().save().then(() => {
            $rootScope.toggleState('success', 'Password changed!', '', 1000);
            $rootScope.toggleState('saving', '', '', 9999);
            $timeout(()=>{
               Parse.User.logOut().then(()=>{
                  root.goto('connect',{passwordChanged:true}); 
               });
            });
        });
    }

}];