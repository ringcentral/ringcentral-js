(function() {

    angular
        .module('RC')
        .controller('MainCtrl', function($scope, $rootScope, rcsdk, errorHandler) {

            var platform = rcsdk.getPlatform();

            /** @type {IExtension} */
            $scope.extension = {};

            $scope.account = {};

            $scope.logout = function() {
                platform.logout().catch(function(e) {
                    errorHandler(e, 'Logout Error');
                });
            };

            platform
                .apiCall({url: '/account/~/extension/~'})
                .then(function(ajax) {
                    $scope.extension = ajax.data;
                })
                .catch(function(e) {
                    errorHandler(e, 'Extension Error');
                });

            platform
                .apiCall({url: '/account/~'})
                .then(function(ajax) {
                    $scope.account = ajax.data;
                    //$scope.ringout.from.phoneNumber = $scope.ringout.from.phoneNumber || account.mainNumber;
                })
                .catch(function(e) {
                    errorHandler(e, 'Account Error');
                });

        });

})();