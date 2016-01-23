/* global _ */
var create = require('../configs/config-angular').createController;

exports.configure = (app) => {
    app.controller('serviceEdit', create(edit));
    app.controller('services', create(list));
};

var list =
    function ($scope, parse, $stateParams, $timeout, $state, $rootScope) {//injects
        var root = $rootScope;
        var owner = Parse.User.current().id;
        var vm = this;
        vm.collection = [];

        root.toggleState('loading', 'Loading..');
        parse.Query('Service')
            .equalTo('owner', Parse.User.current())
            .find().then(function (r) {
                vm.collection = parse.Data(r, ['description', 'price', 'objectId']);
                root.toggleState('loading', '');
                $timeout(() => $scope.$apply());
            });

        vm.onItemTap = (item) => {
            root.goto('service-edit', { id: item.id, owner: owner });
        }
        vm.onNew = () => {
            root.goto('service-edit', { owner: owner });
        };
    };

var edit =
    function ($scope, parse, $stateParams, $timeout, $state, $rootScope) {//injects
        var params = $stateParams;
        var root = $rootScope;
        var owner = params.owner;




        var vm = this;
        vm.model = {};
        vm.originalModel = {};
        vm.fields = [
            {
                key: 'id',
                type: 'input',
                templateOptions: {
                    label: 'Identifier',
                    disabled: true
                }
            },
            {
                key: 'description',
                type: 'input',
                templateOptions: {
                    label: 'Description',
                    placeholder: 'Write a description of your service',
                    required: true
                }
            },
            {
                key: 'price',
                type: 'input', templateOptions: {
                    label: 'Price',
                    required: true
                }
            }
        ];
        
        
        
        //fetch
        if (!owner) {
            console.warn('service owner unknow.');
            root.goto('services');
        } else {
            parse.user.get(owner).then((ownerUser) => {
                if (params.id) {
                    $rootScope.toggleState('loading', 'Loading..');
                    parse.Query('Service').equalTo('objectId', params.id).find().then(function (r) {
                        vm.instance = r[0];
                        vm.model = parse.Data(r, ['description', 'price'])[0];
                        vm.originalModel = _.clone(vm.model);
                        $rootScope.toggleState('loading', '');
                        $timeout(() => $scope.$apply());
                    });
                }
                vm.model.owner = ownerUser;
            });
        }




        $scope.onSave = () => {
            $rootScope.toggleState('saving', 'Saving..');
            parse.Instance('Service', vm.model, vm.instance).save().then(function (r) {
                vm.model = parse.Data([r], ['description', 'price', 'owner'])[0];
                vm.originalModel = _.clone(vm.model);
                $rootScope.toggleState('saving', '');
                $timeout(() => $scope.$apply());
            });
        };

        $scope.onDelete = () => {
            if (window.confirm('sure?')) {
                $rootScope.toggleState('deleting', 'Deleting..');
                parse.Instance('Service', vm.model, vm.instance).destroy().then(function () {
                    $rootScope.toggleState('deleting', '');
                    $scope.onReturnClick();
                });
            }
        };

        $scope.unsaved = () => {
            return _.differenceWith([vm.model], [vm.originalModel], _.isEqual).length !== 0;
        };

        $scope.getReturnLabel = () => {
            if ($scope.unsaved()) {
                return "Cancel";
            } else {
                return 'Return';
            }
        };

        $scope.onReturnClick = () => {
            if ($scope.unsaved()) {
                vm.model = vm.originalModel;
            } else {
                $state.go('services');
            }
        };


    };