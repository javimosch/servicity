
var middlewares = require('./routes-middlewares').middlewares;

exports.routesConfiguration = ($stateProvider, $urlRouterProvider) => {
    $urlRouterProvider.otherwise('/home')



    $stateProvider.state('service-edit', {
        url: '/service/:id',
        templateUrl: './views/service-edit.html',
        params:{
           owner:null
        },
        //onEnter: middlewares.inject(middlewares.SECURE)
    })
    $stateProvider.state('services', {
        url: '/services',
        templateUrl: './views/service-list.html',
        onEnter: middlewares.inject(middlewares.SECURE)
    })
    
    
    $stateProvider.state('connect', {
        url: '/connect',
        templateUrl: './views/connect.html',
        onEnter: middlewares.inject(middlewares.JUMP_WHEN_LOGGED)
    })
    
    
    
    $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: './views/profile.html',
        onEnter: middlewares.inject(middlewares.SECURE)
    })
    
    
    
    $stateProvider.state('user-services', {
        url: '/myservices',
        templateUrl: './views/user-services.html',
        onEnter: middlewares.inject(middlewares.SECURE)
    })
    
    $stateProvider.state('home', {
        url: '/home',
        templateUrl: './views/home.html',
        onEnter: middlewares.inject(middlewares.SESSION)
    })
//    console.log('routeConfiguration');
}
