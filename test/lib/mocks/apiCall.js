define(function(require, exports, module) {

    module.exports = function(Mock) {

        Mock.apiCall = function(path, response, status) {

            Mock.rcsdk.getXhrResponse().add({
                path: path,
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    ajax.setStatus(status || 200);

                    return response;

                }
            });

        };

    };

});