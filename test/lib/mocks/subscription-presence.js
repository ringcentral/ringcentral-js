define(function(require, exports, module) {

    module.exports = function(Mock) {

        Mock.subscribeOnPresence = function(id, detailed) {

            id = id || '1';

            Mock.rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/subscription',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    var date = new Date();

                    return {
                        'eventFilters': [ '/restapi/v1.0/account/~/extension/' + id + '/presence' + (detailed ? '?detailedTelephonyState=true' : '') ],
                        'expirationTime': new Date(date.getTime() + (15 * 60 * 60 * 1000)).toISOString(),
                        'deliveryMode': {
                            'transportType': 'PubNub',
                            'encryption': true,
                            'address': '123_foo',
                            'subscriberKey': 'sub-c-foo',
                            'secretKey': 'sec-c-bar',
                            'encryptionAlgorithm': 'AES',
                            'encryptionKey': 'VQwb6EVNcQPBhE/JgFZ2zw=='
                        },
                        'creationTime': date.toISOString(),
                        'id': 'foo-bar-baz',
                        'status': 'Active',
                        'uri': 'https://platform.ringcentral.com/restapi/v1.0/subscription/foo-bar-baz'
                    };

                }
            });

        };

    };

});