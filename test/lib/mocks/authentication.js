define(function(require, exports, module) {

    module.exports = function(Mock) {

        Mock.authentication = function() {

            Mock.rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/token',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    return {
                        'access_token': 'ACCESS_TOKEN',
                        'token_type': 'bearer',
                        'expires_in': 3600,
                        'refresh_token': 'REFRESH_TOKEN',
                        'refresh_token_expires_in': 60480,
                        'scope': 'SMS RCM Foo Boo',
                        'expireTime': new Date().getTime() + 3600000
                    };

                },
                /**
                 * @param {XhrMock} ajax
                 * @returns {boolean}
                 */
                test: function(ajax) {

                    return (!ajax.data || !ajax.data['refresh_token']);

                }
            });

            Mock.rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/revoke',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    return {};

                }
            });

        };

    };

});