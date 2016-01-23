var middlewares = {
    SECURE: ['redirectVisitorsWithoutSession', 'sessionUpdate'],
    JUMP_WHEN_LOGGED: ['whenSessionJumpToProfile'],
    SESSION: ['sessionUpdate'],
    whenSessionJumpToProfile: ($state, $timeout, sparse) => {
        if (sparse.Parse.User.current() && sparse.Parse.User.current().authenticated()) {
            sparse.Parse.Session.current().then(() => {
                $timeout(() => {
                    $state.go('profile');
                });
            });
        }
    },
    sessionUpdate: ($state, $timeout, sparse) => {
        sparse.Parse.Session.current().fail(() => {
            sparse.Parse.User.logOut().always(() => {
                //if session lost, logout.
            });
        });
        
    },
    redirectVisitorsWithoutSession: ($state, $timeout, sparse) => {
        sparse.Parse.Session.current().fail(() => {
            $timeout(function () {
                $state.go('connect', { sessionExpired: true });
            });
        });
    },
    inject: (_middlewareNames) => {
        var middleware = ($state, $timeout, parse) => {
            _middlewareNames.forEach((k) => {
                middlewares[k]($state, $timeout, parse);
            });
        }
        return ['$state', '$timeout', 'parse', middleware];
    }
};
exports.middlewares = middlewares;