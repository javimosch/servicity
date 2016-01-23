/* global _ */
exports.mainCtrl = ['$scope', function ($scope) {
    console.log('mainCtrl');
}];
exports.listCtrl = ['$scope', 'parseSrv', '$timeout', '$state', function ($scope, parseSrv, $timeout, $state) {
    //console.log('servicesCtrl');

    $scope.collection = [];

    parseSrv.Query('Service').find().then(function (r) {
        $scope.collection = parseSrv.Data(r, ['description', 'price', 'objectId']);
        $timeout(() => $scope.$apply());
    });

    $scope.onItemTap = (item) => {
        $state.go('service-edit', { id: item.id });
    }

    var c = this;

    c.onNew = () => {
        $state.go('service-edit', { id: -1 });
    }

}];

exports.editCtrl = ['$scope', 'parseSrv', '$stateParams', '$timeout', '$state', function ($scope, parseSrv, $stateParams, $timeout, $state) {
    //console.log('serviceEditCtrl');

    var vm = this;
    vm.model = {};
    vm.originalModel = {};
    if ($stateParams.id.toString() !== '-1') {
        console.log('retriving', $stateParams.id);
        parseSrv.Query('Service').equalTo('objectId', $stateParams.id).find().then(function (r) {
            vm.instance = r[0];
            vm.model = parseSrv.Data(r, ['description', 'price'])[0];
            vm.originalModel = _.clone(vm.model);
            $timeout(() => $scope.$apply());
        });
    }

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

    $scope.onSave = () => {
        parseSrv.Instance('Service', vm.model, vm.instance).save().then(function (r) {
            vm.model = parseSrv.Data([r], ['description', 'price', 'objectId'])[0];
            vm.originalModel = _.clone(vm.model);
            $timeout(() => $scope.$apply());
        });
    };

    $scope.onDelete = () => {
        if (window.confirm('sure?')) {
            parseSrv.Instance('Service', vm.model, vm.instance).destroy().then(function () {
                $scope.onCancel();
            });
        }
    };

    $scope.unsaved = () => {
        var changed = false;
        Object.keys(vm.originalModel || {}).forEach(function (k) {
            if (vm.originalModel[k] !== vm.model[k]) {
                changed = true;
            }
        });
        return changed;
    }

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


}];