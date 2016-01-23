
var middlewares = require('./routes-middlewares').middlewares;

exports.routesConfiguration = ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/home')

    $stateProvider.state('service-edit', {
        url: '/service/{id:[0-9a-zA-Z]{1,20}}',
        templateUrl: './views/service-edit.html',
        onEnter: middlewares.inject(middlewares.SECURE)
    })
    $stateProvider.state('services', {
        url: '/services',
        templateUrl: './views/service-list.html',
        controller: 'servicesCtrl',
        onEnter: middlewares.inject(middlewares.SECURE)
    })
    $stateProvider.state('connect', {
        url: '/connect',
        templateUrl: './views/connect.html',
        controller: 'connectCtrl',
        onEnter: middlewares.inject(middlewares.JUMP_WHEN_LOGGED)
    })
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: './views/profile.html',
        onEnter: middlewares.inject(middlewares.SECURE)
    })
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: './views/home.html',
        onEnter: middlewares.inject(middlewares.SESSION)
    })
    console.log('routeConfiguration');
}
