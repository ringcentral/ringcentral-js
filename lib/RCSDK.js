define(function(require, exports, module) {

    'use strict';

    /**
     * @param {IInjections} injections
     * @returns {RCSDK}
     */
    module.exports = function(injections) {

        /**
         * @name RCSDK
         * @param {IOptions} [options]
         * @constructor
         */
        function RCSDK(options) {

            options = options || {};

            /** @private */
            this._context = require('./core/Context').$get(injections);

            this.getCache()
                .setPrefix(options.cachePrefix || '');

            this.getPlatform()
                .setServer(options.server)
                .setCredentials(options.appKey, options.appSecret);

            //TODO Link Platform events with Subscriptions and the rest

        }

        RCSDK.version = '1.2.1';

        // Internals

        /** @returns {Context} */
        RCSDK.prototype.getContext = function() { return this._context; };

        // Core

        /**
         * This is for internal use only
         * @protected
         * @returns {Request}
         */
        RCSDK.prototype.getRequest = function() { return require('./core/http/Request').$get(this.getContext()); };

        /**
         * This is for internal use only
         * @protected
         * @returns {Response}
         */
        RCSDK.prototype.getResponse = function(status, statusText, body, headers) {
            return require('./core/http/Response').$get(this.getContext(), status, statusText, body, headers);
        };

        /**
         * @returns {AjaxObserver}
         */
        RCSDK.prototype.getAjaxObserver = function() { return require('./core/AjaxObserver').$get(this.getContext()); };

        /**
         * This is for internal use only
         * @protected
         * @returns {XhrResponse}
         */
        RCSDK.prototype.getXhrResponse = function() { return require('./core/xhr/XhrResponse').$get(this.getContext()); };

        /**
         * @returns {Platform}
         */
        RCSDK.prototype.getPlatform = function() { return require('./core/Platform').$get(this.getContext()); };

        /**
         * @returns {Cache}
         */
        RCSDK.prototype.getCache = function() { return require('./core/Cache').$get(this.getContext()); };

        /**
         * @returns {Subscription}
         */
        RCSDK.prototype.getSubscription = function() { return require('./core/Subscription').$get(this.getContext()); };

        /**
         * @returns {PageVisibility}
         */
        RCSDK.prototype.getPageVisibility = function() { return require('./core/PageVisibility').$get(this.getContext()); };

        /**
         * @returns {Helper}
         */
        RCSDK.prototype.getHelper = function() { return require('./core/Helper').$get(this.getContext()); };

        /**
         * @returns {Observable}
         */
        RCSDK.prototype.getObservable = function() { return require('./core/Observable').$get(this.getContext()); };

        /**
         * @returns {Validator}
         */
        RCSDK.prototype.getValidator = function() { return require('./core/Validator').$get(this.getContext()); };

        /**
         * @returns {Log}
         */
        RCSDK.prototype.getLog = function() { return require('./core/Log').$get(this.getContext()); };

        /**
         * @returns {Utils}
         */
        RCSDK.prototype.getUtils = function() { return require('./core/Utils').$get(this.getContext()); };

        /**
         * @returns {List}
         */
        RCSDK.prototype.getList = function() { return require('./core/List').$get(this.getContext()); };

        // Helpers

        /**
         * @returns {CountryHelper}
         */
        RCSDK.prototype.getCountryHelper = function() { return require('./helpers/Country').$get(this.getContext()); };

        /**
         * @returns {DeviceModelHelper}
         */
        RCSDK.prototype.getDeviceModelHelper = function() { return require('./helpers/DeviceModel').$get(this.getContext()); };

        /**
         * @returns {LanguageHelper}
         */
        RCSDK.prototype.getLanguageHelper = function() { return require('./helpers/Language').$get(this.getContext()); };

        /**
         * @returns {LocationHelper}
         */
        RCSDK.prototype.getLocationHelper = function() { return require('./helpers/Location').$get(this.getContext()); };

        /**
         * @returns {ShippingMethodHelper}
         */
        RCSDK.prototype.getShippingMethodHelper = function() { return require('./helpers/ShippingMethod').$get(this.getContext()); };

        /**
         * @returns {StateHelper}
         */
        RCSDK.prototype.getStateHelper = function() { return require('./helpers/State').$get(this.getContext()); };

        /**
         * @returns {TimezoneHelper}
         */
        RCSDK.prototype.getTimezoneHelper = function() { return require('./helpers/Timezone').$get(this.getContext()); };

        /**
         * @returns {AccountHelper}
         */
        RCSDK.prototype.getAccountHelper = function() { return require('./helpers/Account').$get(this.getContext()); };

        /**
         * @returns {BlockedNumberHelper}
         */
        RCSDK.prototype.getBlockedNumberHelper = function() { return require('./helpers/BlockedNumber').$get(this.getContext()); };

        /**
         * @returns {CallHelper}
         */
        RCSDK.prototype.getCallHelper = function() { return require('./helpers/Call').$get(this.getContext()); };

        /**
         * @returns {ConferencingHelper}
         */
        RCSDK.prototype.getConferencingHelper = function() { return require('./helpers/Conferencing').$get(this.getContext()); };

        /**
         * @returns {ContactHelper}
         */
        RCSDK.prototype.getContactHelper = function() { return require('./helpers/Contact').$get(this.getContext()); };

        /**
         * @returns {ContactGroupHelper}
         */
        RCSDK.prototype.getContactGroupHelper = function() { return require('./helpers/ContactGroup').$get(this.getContext()); };

        /**
         * @returns {DeviceHelper}
         */
        RCSDK.prototype.getDeviceHelper = function() { return require('./helpers/Device').$get(this.getContext()); };

        /**
         * @returns {ExtensionHelper}
         */
        RCSDK.prototype.getExtensionHelper = function() { return require('./helpers/Extension').$get(this.getContext()); };

        /**
         * @returns {ForwardingNumberHelper}
         */
        RCSDK.prototype.getForwardingNumberHelper = function() { return require('./helpers/ForwardingNumber').$get(this.getContext()); };

        /**
         * @returns {MessageHelper}
         */
        RCSDK.prototype.getMessageHelper = function() { return require('./helpers/Message').$get(this.getContext()); };

        /**
         * @returns {PhoneNumberHelper}
         */
        RCSDK.prototype.getPhoneNumberHelper = function() { return require('./helpers/PhoneNumber').$get(this.getContext()); };

        /**
         * @returns {PresenceHelper}
         */
        RCSDK.prototype.getPresenceHelper = function() { return require('./helpers/Presence').$get(this.getContext()); };

        /**
         * @returns {RingoutHelper}
         */
        RCSDK.prototype.getRingoutHelper = function() { return require('./helpers/Ringout').$get(this.getContext()); };

        /**
         * @returns {ServiceHelper}
         */
        RCSDK.prototype.getServiceHelper = function() { return require('./helpers/Service').$get(this.getContext()); };

        if (!injections
            || !('CryptoJS' in injections)
            || !('localStorage' in injections)
            || !('Promise' in injections)
            || !('PUBNUB' in injections)
            || !('XHR' in injections)) throw new Error('Injections object is not complete');

        injections.XHR = (injections.XHR || function() {
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
            throw new Error("This browser does not support XMLHttpRequest.");
        });

        return RCSDK;

    };

    /**
     * @typedef {Object} IInjections
     * @property {PUBNUB} PUBNUB
     * @property {CryptoJS} CryptoJS
     * @property {Storage} localStorage
     * @property {XMLHttpRequest} XHR
     * @property {Promise} Promise
     */

    /**
     * @typedef {Object} IOptions
     * @property {string} server
     * @property {string} appKey
     * @property {string} appSecret
     * @property {string} [cachePrefix]
     */

});
