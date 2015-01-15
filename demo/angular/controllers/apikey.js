(function() {

    angular
        .module('RC')
        .controller('ApikeyCtrl', function($scope, $location, $window, rcsdk) {

            var platform = rcsdk.getPlatform(),
                decoded = atob(platform.apiKey).split(':');

            $scope.appKey = decoded[0] || '';
            $scope.appSecret = decoded[1] || '';
            $scope.server = platform.server;
            $scope.isTokenValid = platform.isTokenValid();

            $scope.save = function() {

                if (!$scope.appKey || !$scope.appSecret || !$scope.server) {
                    alert('All fields are required');
                    return;
                }

                if (platform.isTokenValid()) platform.logout();

                var apiKey = btoa([$scope.appKey, $scope.appSecret].join(':'));

                localStorage.setItem('rscdk-demo-apiKey', apiKey);
                localStorage.setItem('rscdk-demo-server', $scope.server);

                platform.apiKey = apiKey;
                platform.server = $scope.server;

                $location.replace().path('/');

            };

            $scope.back = function() {

                $window.history.back()
            };

        });


})();