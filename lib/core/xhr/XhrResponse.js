var define = typeof define === 'function' && define.amd ? define : function (factory) {
    factory(require, exports, module);
};
define(function (require, exports, module) {
    var XhrResponse = function () {
        function XhrResponse(context) {
            this.responses = [];
        }
        XhrResponse.prototype.add = function (response) {
            this.responses.push(response);
        };
        XhrResponse.prototype.clear = function () {
            this.responses = [];
        };
        XhrResponse.prototype.find = function (ajax) {
            var currentResponse = null;
            this.responses.forEach(function (response) {
                if (ajax.url.indexOf(response.path) > -1 && (!response.test || response.test(ajax))) {
                    currentResponse = response;
                }
            });
            return currentResponse;
        };
        return XhrResponse;
    }();
    exports.XhrResponse = XhrResponse;
    function $get(context) {
        return context.createSingleton('XhrResponse', function () {
            return new XhrResponse(context);
        });
    }
    exports.$get = $get;
});