var getQuery = require('./parse-common').getQuery;
var getAll = require('./parse-common').getAll;
var setDataToInstance = require('./parse-common').setDataToInstance;
var updateInstance = require('./parse-common').updateInstance;

var user = (() => {
    var FIELDS = ['username', 'email'];
    var instance = () => { };
    var get = (id) => {
        if (Parse.User.current() && Parse.User.current().id == id) {
            var rta = new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(Parse.User.current())
                }, 0);
            });
            return rta;
        } else {
            return getQuery('User').equalTo('objectId', id).first();
        }
    };
    return {
        get: get
    };
})();

var userService = () => {
    var FIELDS = ['owner', 'description', 'features', 'price', 'clients'];
    var getAll = (fields, options) => {
        var _userServices = getAll('userService', fields, options);
    };
    return {
        getAll: getAll
    };
};




var inject = (srv) => {
    Object.keys(METHODS).forEach((k) => {
        srv[k] = METHODS[k];
    });
    return srv;
};
var METHODS = {
    user: user,
    userService: userService,
    inject: inject
};
Object.keys(METHODS).forEach((k) => {
    exports[k] = METHODS[k];
});
