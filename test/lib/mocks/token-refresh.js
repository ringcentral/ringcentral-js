define(function(require, exports, module) {

    module.exports = function(Mock) {

        Mock.tokenRefresh = function(failure) {

            Mock.rcsdk.getXhrResponse().add({
                path: '/restapi/oauth/token',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    if (!failure) return {
                        'access_token': 'ACCESS_TOKEN_FROM_REFRESH',
                        'token_type': 'bearer',
                        'expires_in': 3600,
                        'refresh_token': 'REFRESH_TOKEN_FROM_REFRESH',
                        'refresh_token_expires_in': 60480,
                        'scope': 'SMS RCM Foo Boo',
                        'expireTime': new Date().getTime() + 3600000
                    };

                    ajax.setStatus(400);

                    return {
                        'message': 'Wrong token',
                        'error_description': 'Wrong token',
                        'description': 'Wrong token'
                    };

                },
                /**
                 * @param {XhrMock} ajax
                 * @returns {boolean}
                 */
                test: function(ajax) {

                    return (ajax.data && ajax.data['refresh_token']);

                }
            });

        };

    };

});