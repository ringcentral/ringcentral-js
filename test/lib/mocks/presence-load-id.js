define(function(require, exports, module) {

    module.exports = function(Mock) {

        Mock.presenceLoad = function(id, detailed) {

            Mock.rcsdk.getXhrResponse().add({
                path: '/restapi/v1.0/account/~/extension/' + id + '/presence',
                /**
                 * @param {XhrMock} ajax
                 * @returns {Object}
                 */
                response: function(ajax) {

                    return {
                        "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id + "/presence",
                        "extension": {
                            "uri": "https://platform.ringcentral.com/restapi/v1.0/account/123/extension/" + id,
                            "id": id,
                            "extensionNumber": "101"
                        },
                        "activeCalls": [],
                        "presenceStatus": "Available",
                        "telephonyStatus": "Ringing",
                        "userStatus": "Available",
                        "dndStatus": "TakeAllCalls",
                        "extensionId": id
                    };

                }
            });

        };

    };

});