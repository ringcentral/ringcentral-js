(function() {

    angular
        .module('RC')
        .controller('LoginCtrl', function($scope, $location, rcsdk, errorHandler) {

            var platform = rcsdk.getPlatform();

            // This is for debug purposes, as a developer you can save your credentials if you need
            $scope.user = {
                username: localStorage.getItem('rscdk-demo-login-username') || '',
                extension: localStorage.getItem('rscdk-demo-login-extension') || '',
                password: localStorage.getItem('rscdk-demo-login-password') || '',
                remember: !!localStorage.getItem('rscdk-demo-login-remember')
            };

            $scope.options = {loading: false};

            $scope.login = function() {

                $scope.options.loading = true;

                platform
                    .authorize({
                        username: $scope.user.username,
                        extension: $scope.user.extension || '',
                        password: $scope.user.password,
                        remember: $scope.user.remember
                    })
                    .then(function() {
                        $scope.options.loading = false;
                        if ($scope.user.remember) {
                            localStorage.setItem('rscdk-demo-login-username', $scope.user.username);
                            localStorage.setItem('rscdk-demo-login-extension', $scope.user.extension || '');
                            localStorage.setItem('rscdk-demo-login-password', $scope.user.password);
                            localStorage.setItem('rscdk-demo-login-remember', $scope.user.remember);
                        }
                        $location.replace().path('/');
                    })
                    .catch(function(e) {
                        $scope.options.loading = false;
                        errorHandler(e);
                    });

            };

            if (!platform.apiKey) $location.replace().path('/apikey');

        });


})();