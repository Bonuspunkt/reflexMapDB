var routes = [];
var started = false;

var idMatch = /:(\w[\w\d]*)/g;
var idReplacement = "([^\\/]+)";
var globMatch = /\*(\w[\w\d]*)/;
var globReplacement = "(.+)";

function convertRouteToRegExp(route) {
    // Sub in based on IDs and globs
    route = route.replace(idMatch, idReplacement);
    route = route.replace(globMatch, globReplacement);
    // Make sure it's an exact match
    route = "^" + route + "$";

    return new RegExp(route);
}

function getParameterNames(route) {
    var parameterNames = [], match;

    idMatch.lastIndex = 0;

    while ((match = idMatch.exec(route)) !== null) {
        parameterNames.push(match[1]);
    }
    if ((match = globMatch.exec(route)) !== null) {
        parameterNames.push(match[1]);
    }

    return parameterNames.length > 0 ? parameterNames : null;
}

function handleNewRoute(e, path) {
    if (!e) { e = { preventDefault: function() {} }; }

    var matchingRoute = routes.filter(function(route) {
        return route.pattern.test(path);
    })[0];

    // -- remove
    if (!matchingRoute) {
        path += '/';
        matchingRoute = routes.filter(function(route) {
            return route.pattern.test(path);
        })[0]
    }
    // -- /remove

    if (!matchingRoute) { return; }

    e.preventDefault();

    var result = matchingRoute.pattern.exec(path);
    var params = {};

    if (matchingRoute.parameterNames) {
        var parameterNames = matchingRoute.parameterNames;

        parameterNames.forEach(function (param, i) {
            params[parameterNames[i]] = result[i + 1];
        });
    } else {
        params = result.slice(1);
    }

    matchingRoute.handler({ params: params });
    history.pushState(null, null, path);
}


module.exports = {
    registerRoute: function(pattern, handler) {
        var routeObj = {
            pattern: pattern,
            handler: handler
        };

        if (typeof (pattern) === 'string') {
            routeObj.parameterNames = getParameterNames(pattern);
            routeObj.pattern = convertRouteToRegExp(pattern);
        }

        routes.push(routeObj);
    },

    start: function() {
        if (started) { return; }
        if (!history.pushState) {
            // no support for history pushState
            return;
        }

        document.body.addEventListener('click', function(e) {
            var target = e.target;
            while (target && target.tagName !== 'A') {
                target = target.parentNode;
            }
            if (!target) { return; }

            handleNewRoute(e, target.pathname)
        });

        window.addEventListener('popstate', function(e) {
            handleNewRoute(null, location.pathname);
        });

        started = true;
    }
};
