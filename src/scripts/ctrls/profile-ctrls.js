/* global Parse */
/* global _ */
var create = require('../configs/config-angular').createController;

exports.configure = (app) => {
    app.controller('profileGeneral', create(general));
    app.controller('profileDetails', create(details));
    app.controller('profileServices', create(services));
};


var services =
    function ($scope, parse, $stateParams, $timeout, $state, $rootScope) {//injects
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
        
        //fetch
        var columns = ['description', 'price'];
        parse.Query('Service')
            .equalTo('owner', Parse.User.current())
            .select(columns)
            .find().then(function (r) {
                c.services = parse.Data(r, columns);
                $timeout(() => $scope.$apply());
            });

        c.select = (index) => {
            if (index.toString() === '+1') {
                c.active++;
            } else if (index.toString() === '-1') {
                c.active--;
            } else {
                c.active = index;
            }
        };
    };


var general =
    function ($scope, parse, $stateParams, $timeout, $state, $rootScope) {//injects
        
        var c = this;
        c.user = Parse.User.current();
        c.model = parse.Data([c.user], ['nick'])[0];

        var update = setInterval(function () {
            var data = parse.Data([c.user], ['nick'])[0];

            //console.log(c.model, data);


            if (_.differenceWith([data], [c.model], _.isEqual).length !== 0) {
                $rootScope.toggleState('saving', 'Saving..', '', 9999);
                $timeout(() => $scope.$apply());
                parse.Instance('User', c.model, c.user).save().then(function () {
                    $timeout(() => {
                        $rootScope.toggleState('saving', '', '', 0);
                        $scope.$apply()
                    }, 500);
                });
            }
        }, 2000);
        $scope.$on('$destroy', () => { clearInterval(update); });
    };


var details =
    function ($scope, parse, $stateParams, $timeout, $state, $rootScope) {//injects
        var root = $rootScope;
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
                template: "<hr/>"
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
            vm.model = Object.assign(parse.Data([r], ['username'
                , 'email', 'lastName', 'firstName'])[0], {
                    password: '123456'
                });
            vm.original = _.clone(vm.model);
        });


        vm.changed = () => {
            if (!vm.original) return false;
            return _.differenceWith([vm.original], [vm.model], _.isEqual).length !== 0;
        };

        vm.save = () => {

            $rootScope.toggleState('saving', 'Saving..');
            parse.Instance('User', vm.model, Parse.User.current()).save().then(() => {
                $rootScope.toggleState('saving', '');
                $rootScope.toggleState('saving', 'Saved !', '', 2000);
            });

            if (vm.original.password !== vm.model.password) {
                if (root.question("If you change the password you will need to re-login using the new password right after press 'OK'")) {
                    changePassword(vm.model.password);
                }
            }
        }

        function changePassword(password) {
            Parse.User.current().setPassword(password);
            $rootScope.toggleState('saving', 'Saving..', '', 9999);
            Parse.User.current().save().then(() => {
                $rootScope.toggleState('success', 'Password changed!', '', 1000);
                $rootScope.toggleState('saving', '', '', 9999);
                $timeout(() => {
                    Parse.User.logOut().then(() => {
                        root.goto('connect', { passwordChanged: true });
                    });
                });
            });
        }

    };