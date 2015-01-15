/**
 * How to demo:
 * 1. Start HTTP server
 *
 * Python:
 * python -m SimpleHTTPServer 8888
 *
 * PHP:
 * php -S localhost:8888
 *
 * NodeJS:
 * npm install --global http-server
 * http-server -p 8888 --cors
 *
 * 2. Open http://localhost:8888 in your browser
 *
 * 3. Copy-paste API key
 *
 * 4. Log in using
 */
(function() {

    var rcsdk = new RCSDK(),
        platform = rcsdk.getPlatform(),
        visibility = rcsdk.getPageVisibility(),
        log = rcsdk.getLog(),
        ajaxObserver = rcsdk.getAjaxObserver(),
        publicPages = ['/login', '/error', '/apikey'];

    platform.apiKey = localStorage.getItem('rscdk-demo-apiKey');
    platform.server = localStorage.getItem('rscdk-demo-server');

    // Enable all log levels except debug
    log.enableAll();
    log.logDebug = false;

    angular
        .module('RC', ['ngRoute'])
        .config(function($logProvider, $locationProvider, $routeProvider, $httpProvider) {

            $logProvider.debugEnabled(!!localStorage.getItem('debug'));
            $locationProvider.html5Mode(false).hashPrefix('');

            $httpProvider.interceptors.push(function() {
                return {
                    'request': function(config) {
                        return angular.extend({
                            params: {
                                noCache: Date.now()
                            },
                            cache: false
                        }, config);
                    }
                }
            });

            /**
             * Reusable function to check auth status when route changes
             * @param {$location} $location
             * @param {$log} $log
             * @returns {boolean|Promise}
             */
            function checkAuth($location, $log) {

                // The only accessible pages w/o authorization are login and error pages
                if (publicPages.indexOf($location.path()) > -1) return true;

                if (!platform.isTokenValid()) $log.warn('$routeProvider.chechAuth(', $location.path(), '): Token is not valid, refresh will be performed');

                return platform.isAuthorized();

            }

            $routeProvider
                .when('/', {
                    controller: 'MainCtrl',
                    templateUrl: 'controllers/main.html',
                    resolve: {auth: checkAuth} // This will ensure route will not be opened if no authentication
                })
                .when("/login", {
                    controller: 'LoginCtrl',
                    templateUrl: 'controllers/login.html'
                })
                .when("/apikey", {
                    controller: 'ApikeyCtrl',
                    templateUrl: 'controllers/apikey.html'
                })
                .otherwise({
                    controller: 'ErrorCtrl'
                });

        })
        .factory('errorHandler', function($rootScope, $log) {
            return function(e, message, unrecoverable) {

                if (e) {

                    if (message) {
                        $log.error(message);
                        e.title = message;
                    }

                    $log.error(e.stack || e);

                    e.unrecoverable = !!unrecoverable;

                }

                $rootScope.error = e;

            }
        })
        .factory('rcsdk', function() {
            return rcsdk;
        })
        .run(function($rootScope, $location, $timeout, errorHandler) {

            /**
             * Add support of Angular-specific $rootScope phases to SDK AJAX class
             */
            ajaxObserver.on([ajaxObserver.events.requestSuccess, ajaxObserver.events.requestError], function() {

                $timeout(function() {
                    if ($rootScope.$$phase) {
                        $rootScope.$eval();
                    } else {
                        $rootScope.$apply();
                    }
                });

            });

            /**
             * Capture Platform's access-related events and redirect user to Login page
             */
            platform.on([platform.events.accessViolation, platform.events.logoutSuccess], function(e) {

                if (publicPages.indexOf($location.path()) == -1) $location.path('/login');

            });

            /**
             * Automatic logout
             */
            visibility.on(visibility.events.change, function(visible) {

                if (visible) platform.isAuthorized();

            });

            $rootScope.$on('$routeChangeStart', function(event, current, next) {
                errorHandler(null);
            });

            $rootScope.$on('$routeChangeError', function(event, current, previous, rejection) {
                errorHandler(rejection, 'Route change error', true);
            });

            errorHandler(null);

            if (!platform.apiKey) $location.replace().path('/apikey');

        })
        .controller('ErrorCtrl', function(errorHandler) {

            errorHandler(new Error('404 Page Not Found'), null, true);

        });

})();