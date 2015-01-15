(function() {

    angular
        .module('RC')
        .controller('RingoutCtrl', function($scope, rcsdk, errorHandler) {

            var platform = rcsdk.getPlatform(),
                Ringout = rcsdk.getRingoutHelper(),
                Utils = rcsdk.getUtils(),
                Log = rcsdk.getLog(),
                ForwardingNumber = rcsdk.getForwardingNumberHelper(),
                Cache = rcsdk.getCache(),
                timeout = null, // reference to timeout object
                ringout = {}, // this is the status object (lowercase)
                last = Cache.getItem('ringout-last') || {};

            /** @type {IRingout} */
            $scope.ringout = {
                from: {phoneNumber: last.from || ''},
                to: {phoneNumber: last.to || ''},
                playPrompt: ('playPrompt' in last) ? last.playPrompt : true
            };
            $scope.Ringout = Ringout;
            $scope.ForwardingNumber = ForwardingNumber;
            $scope.forwardingNumbers = [];
            $scope.options = {
                loading: false,
                fromCustom: last.fromCustom || null,
                isCustom: last.isCustom || false
            };

            /**
             * @param {Error} e
             */
            function handleError(e) {
                $scope.options.loading = false;
                errorHandler(e, 'RingOut Error');
            }

            function create(unsavedRingout) {

                $scope.options.loading = true;

                platform
                    .apiCall(Ringout.saveRequest(unsavedRingout))
                    .then(function(ajax) {

                        Utils.extend($scope.ringout, ajax.data);

                        Log.info('First status:', $scope.ringout.status.callStatus);

                        timeout = Utils.poll(update, 500, timeout);

                        $scope.options.loading = false;

                    })
                    .catch(handleError);

            }

            /**
             * @param {function(number?)} next - callback that will be used to continue polling
             * @param {number} delay - last used delay
             */
            function update(next, delay) {

                if (!Ringout.isInProgress($scope.ringout)) return;

                $scope.options.loading = true;

                platform
                    .apiCall(Ringout.loadRequest($scope.ringout))
                    .then(function(ajax) {

                        Utils.extend($scope.ringout, ajax.data);

                        Log.info('Current status:', $scope.ringout.status.callStatus);

                        timeout = next(delay);

                        $scope.options.loading = false;

                    })
                    .catch(handleError);

            }

            /**
             * To stop polling call this at any time
             * @param {boolean} [skipRemove]
             */
            function hangUp(skipRemove) {

                Utils.stopPolling(timeout);

                function reset() {
                    $scope.options.loading = false;
                    Ringout.resetAsNew($scope.ringout);
                }

                if (Ringout.isInProgress($scope.ringout)) {
                    platform.apiCall(Ringout.deleteRequest($scope.ringout)).then(reset).catch(handleError);
                } else {
                    reset();
                }

            }

            function loadForwardingNumbers() {

                $scope.options.loading = true;

                platform
                    .apiCall(ForwardingNumber.loadRequest(null, {
                        get: {
                            perPage: 'max'
                        }
                    }))
                    .then(function(ajax) {

                        $scope.forwardingNumbers = ajax.data.records.sort(ForwardingNumber.comparator({}));

                        if (!$scope.options.fromCustom) $scope.options.fromCustom = $scope.forwardingNumbers[0];

                        $scope.options.loading = false;

                    })
                    .catch(handleError);

            }

            $scope.onHangUp = function() {

                hangUp();

            };

            $scope.onCall = function() {

                if (!$scope.options.isCustom) $scope.ringout.from.phoneNumber = $scope.options.fromCustom.phoneNumber;

                last = {
                    from: $scope.ringout.from.phoneNumber,
                    to: $scope.ringout.to.phoneNumber,
                    playPrompt: $scope.ringout.playPrompt,
                    fromCustom: $scope.options.fromCustom,
                    isCustom: $scope.options.isCustom
                };

                Cache.setItem('ringout-last', last);

                create($scope.ringout);

            };

            $scope.$on('$locationChangeStart', /** @type Event */ function(e) {
                if (Ringout.isInProgress($scope.ringout) && !confirm('You are leaving RingOut.\n\nCall will not be affected, but you will not receive status updates on that call.\n\nAre you sure you want to leave RingOut?')) {
                    e.preventDefault();
                    return false;
                }
                return true;
            });

            $scope.$on('$destroy', function() {
                hangUp(true);
            });

            loadForwardingNumbers();

        })


})();