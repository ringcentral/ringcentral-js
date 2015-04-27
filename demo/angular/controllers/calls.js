(function() {

    angular
        .module('RC')
        .controller('CallsCtrl', function($scope, $interval, $log, rcsdk, errorHandler) {

            var platform = rcsdk.getPlatform(),
                Promise = rcsdk.getContext().getPromise(),
                Presence = rcsdk.getPresenceHelper(),
                Call = null,
                PageVisibility = rcsdk.getPageVisibility(),
                latencyCompensation = 2,
                intervals = [],
                subscription = Presence.getSubscription({detailed: true}),
                promise = Promise.resolve(true);

            $scope.options = {
                loading: false,
                inProgressCount: 0,
                userStatuses: ['Available', 'Busy', 'Offline'],
                dndStatuses: ['TakeAllCalls', 'DoNotAcceptAnyCalls', 'DoNotAcceptDepartmentCalls', 'TakeDepartmentCallsOnly']
            };

            $scope.Call = Call = rcsdk.getCallHelper(); // Share Call Helper to view

            /** @type {IPresence} */
            $scope.presence = {};

            /** @type {ICall[]} */
            $scope.presenceCalls = [];

            /** @type {ICall[]} */
            $scope.allCalls = [];

            /**
             * @param {IPresence} presence
             */
            function onPresenceUpdate(presence) {

                $scope.presence = presence;

                $scope.options.loading = true;

                promise = promise.then(function() { // this will ensure that new requests are not made before old ones are loaded

                    return Promise
                        .all([updateCalls()]) //TODO Put back updateActiveCalls() into array
                        .then(function(res) {

                            $scope.presenceCalls = Call.mergePresenceCalls($scope.presenceCalls, $scope.presence);
                            $scope.allCalls = processCalls($scope.presenceCalls, res[0], res[1]);
                            $scope.options.loading = false;

                            $scope.$apply();

                            return $scope.allCalls;

                        })
                        .catch(function(e) {
                            $scope.options.loading = false;
                            $scope.$apply();
                            console.error(e);
                        });

                });

                return promise;


            }

            function updatePresence() {

                if (!PageVisibility.isVisible()) return;

                return platform
                    .apiCall({
                        url: Presence.createUrl({detailed: true})
                    })
                    .then(function(ajax) {
                        return onPresenceUpdate(Presence.parseMultipartResponse(ajax)[0]);
                    })
                    .catch(function(e) {
                        errorHandler(e, 'Presence Error');
                        throw e;
                    });

            }

            function updateActiveCalls() {

                if (!PageVisibility.isVisible()) return rcsdk.getContext().getPromise().reject(new Error('Invisible'));

                return platform
                    .apiCall({
                        url: Call.createUrl({active: true})
                    })
                    .then(function(ajax) {
                        return ajax.data.records;
                    })
                    .catch(function(e) {
                        errorHandler(e, 'Active Calls Error');
                        throw e;
                    });

            }

            function updateCalls() {

                if (!PageVisibility.isVisible()) return rcsdk.getContext().getPromise().reject(new Error('Invisible'));

                return platform
                    .apiCall({
                        url: Call.createUrl()
                    })
                    .then(function(ajax) {
                        return ajax.data.records;
                    })
                    .catch(function(e) {
                        errorHandler(e, 'Calls Error');
                        throw e;
                    });

            }

            /**
             * Calculate duration based on call.startTime and current time
             * @param {ICall} call
             * @returns {ICall}
             */
            function setDuration(call) {
                call.duration = Math.ceil((Date.now() - new Date(call.startTime)) / 1000) - latencyCompensation;
                if (call.duration < 0 || !call.startTime) call.duration = 0; // call.startTime check is just for safety
                return call;
            }

            function processCalls(presenceCalls, calls, activeCalls) {

                destroyIntervals();

                $scope.options.inProgressCount = 0;

                return Call.mergeAll(presenceCalls, calls, activeCalls)
                    .map(function(call) {

                        if (Call.isInProgress(call)) {
                            $scope.options.inProgressCount++;
                            intervals.push($interval(setDuration.bind(null, call), 1000));
                            setDuration(call);
                        }

                        return call;

                    });

            }

            function destroyIntervals() {

                intervals.forEach(function(interval) {
                    $interval.cancel(interval);
                });

                intervals = [];

            }

            // Destruction

            function destroy() {

                $log.info('Destroying');

                destroyIntervals();

                // In order to release subscription we need to remove it at server
                // Token check will not result in refresh process, as opposed to platform.isAuthorized()
                if (platform.isTokenValid()) subscription.remove({async: false});

                subscription.destroy();

            }

            window.addEventListener('beforeunload', destroy);

            platform.on([platform.events.accessViolation, platform.events.beforeLogout], destroy);

            // This occurs when user navigates away from the controller
            $scope.$on('$destroy', function() {
                window.removeEventListener('beforeunload', destroy);
                platform.off([platform.events.accessViolation, platform.events.beforeLogout], destroy);
                destroy();
            });

            // Presence save

            $scope.savePresence = function() {

                platform
                    .apiCall(Presence.saveRequest({
                        userStatus: $scope.presence.userStatus,
                        dndStatus: $scope.presence.dndStatus
                    }, {
                        method: 'PUT',
                        url: Presence.createUrl()
                    }))
                    .then(function(ajax) {
                        onPresenceUpdate(ajax.data);
                    })
                    .catch(function(e) {
                        errorHandler(e, 'Presence Save Error');
                    });

            };

            // Load data

            subscription.on(subscription.events.notification, function(msg) {
                $log.info('Subscription', msg);
                onPresenceUpdate(msg.body);
            });

            subscription
                .register()
                .then(function(ajax) {})
                .catch(function(e) {
                    errorHandler(e, 'Presence Subscription Error');
                });

            updatePresence();

        });

})();