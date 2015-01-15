define(function(require, exports, module) {

    module.exports = function(Mock) {

        Mock.subscribeGeneric = function(expiresIn) {

            Mock.rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/subscription',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    expiresIn = expiresIn || 15 * 60 * 60;

                    var date = new Date();

                    return {
                        'eventFilters': ajax.data.eventFilters,
                        'expirationTime': new Date(date.getTime() + (expiresIn * 1000)).toISOString(),
                        'expiresIn': expiresIn,
                        'deliveryMode': {
                            'transportType': 'PubNub',
                            'encryption': false,
                            'address': '123_foo',
                            'subscriberKey': 'sub-c-foo',
                            'secretKey': 'sec-c-bar'
                        },
                        'id': 'foo-bar-baz',
                        'creationTime': date.toISOString(),
                        'status': 'Active',
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
                    };

                }
            });

        };

    };

});