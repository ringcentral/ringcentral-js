(function() {

    if (typeof exports !== 'undefined') { // NodeJS

        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = RCSDK({
                CryptoJS: require('crypto-js'),
                localStorage: new (require('dom-storage'))(),
                Promise: require('es6-promise').Promise,
                PUBNUB: require('pubnub'),
                XHR: require('xhr2')
            });
        }

    } else if (typeof define === 'function' && define.amd) { // RequireJS

        define(['crypto-js', 'pubnub', 'es6-promise'], function(CryptoJS, PUBNUB) { // amdclean
            return RCSDK({
                CryptoJS: CryptoJS,
                PUBNUB: PUBNUB
            });
        });

    } else { // Standalone in browser

        RCSDK.noConflict = (function(old) {
            return function() {
                root.RCSDK = old;
                RCSDK.noConflict = undefined;
                return RCSDK;
            };
        })(root.RCSDK);

        root.RCSDK = RCSDK({});

    }

})();