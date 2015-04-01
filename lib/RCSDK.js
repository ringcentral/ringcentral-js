var xhrResponse = require('./core/xhr/XhrResponse');
var ajaxObserver = require('./core/AjaxObserver');
var cache = require('./core/Cache');
var context = require('./core/Context');
var helper = require('./core/Helper');
var list = require('./core/List');
var log = require('./core/Log');
var observable = require('./core/Observable');
var pageVisibility = require('./core/PageVisibility');
var platform = require('./core/Platform');
var subscription = require('./core/Subscription');
var utils = require('./core/Utils');
var validator = require('./core/Validator');
var accountHelper = require('./helpers/Account');
var blockedNumberHelper = require('./helpers/BlockedNumber');
var callHelper = require('./helpers/Call');
var contactHelper = require('./helpers/Contact');
var contactGroupHelper = require('./helpers/ContactGroup');
var conferencingHelper = require('./helpers/Conferencing');
var countryHelper = require('./helpers/Country');
var deviceHelper = require('./helpers/Device');
var deviceModelHelper = require('./helpers/DeviceModel');
var extensionHelper = require('./helpers/Extension');
var forwardingNumberHelper = require('./helpers/ForwardingNumber');
var languageHelper = require('./helpers/Language');
var locationHelper = require('./helpers/Location');
var messageHelper = require('./helpers/Message');
var phoneNumberHelper = require('./helpers/PhoneNumber');
var presenceHelper = require('./helpers/Presence');
var ringoutHelper = require('./helpers/Ringout');
var serviceHelper = require('./helpers/Service');
var shippingMethodHelper = require('./helpers/ShippingMethod');
var stateHelper = require('./helpers/State');
var timezoneHelper = require('./helpers/Timezone');
var RCSDK = (function () {
    function RCSDK(options) {
        options = options || {};
        this._context = context.$get(RCSDK.injections);
        this.getCache().setPrefix(options.cachePrefix || '');
        this.getPlatform().setServer(options.server || '').setCredentials(options.appKey || '', options.appSecret || '');
        //TODO Link Platform events with Subscriptions and the rest
    }
    RCSDK.setInjections = function (injections) {
        this.injections = injections;
        return this;
    };
    // Internals
    RCSDK.prototype.getContext = function () {
        return this._context;
    };
    // Core
    RCSDK.prototype.getAjaxObserver = function () {
        return ajaxObserver.$get(this.getContext());
    };
    RCSDK.prototype.getXhrResponse = function () {
        return xhrResponse.$get(this.getContext());
    };
    RCSDK.prototype.getPlatform = function () {
        return platform.$get(this.getContext());
    };
    RCSDK.prototype.getCache = function () {
        return cache.$get(this.getContext());
    };
    RCSDK.prototype.getSubscription = function () {
        return subscription.$get(this.getContext());
    };
    RCSDK.prototype.getPageVisibility = function () {
        return pageVisibility.$get(this.getContext());
    };
    RCSDK.prototype.getHelper = function () {
        return helper.$get(this.getContext());
    };
    RCSDK.prototype.getObservable = function () {
        return observable.$get(this.getContext());
    };
    RCSDK.prototype.getValidator = function () {
        return validator.$get(this.getContext());
    };
    RCSDK.prototype.getLog = function () {
        return log.$get(this.getContext());
    };
    RCSDK.prototype.getUtils = function () {
        return utils.$get(this.getContext());
    };
    RCSDK.prototype.getList = function () {
        return list.$get(this.getContext());
    };
    // Helpers
    RCSDK.prototype.getCountryHelper = function () {
        return countryHelper.$get(this.getContext());
    };
    RCSDK.prototype.getDeviceModelHelper = function () {
        return deviceModelHelper.$get(this.getContext());
    };
    RCSDK.prototype.getLanguageHelper = function () {
        return languageHelper.$get(this.getContext());
    };
    RCSDK.prototype.getLocationHelper = function () {
        return locationHelper.$get(this.getContext());
    };
    RCSDK.prototype.getShippingMethodHelper = function () {
        return shippingMethodHelper.$get(this.getContext());
    };
    RCSDK.prototype.getStateHelper = function () {
        return stateHelper.$get(this.getContext());
    };
    RCSDK.prototype.getTimezoneHelper = function () {
        return timezoneHelper.$get(this.getContext());
    };
    RCSDK.prototype.getAccountHelper = function () {
        return accountHelper.$get(this.getContext());
    };
    RCSDK.prototype.getBlockedNumberHelper = function () {
        return blockedNumberHelper.$get(this.getContext());
    };
    RCSDK.prototype.getCallHelper = function () {
        return callHelper.$get(this.getContext());
    };
    RCSDK.prototype.getConferencingHelper = function () {
        return conferencingHelper.$get(this.getContext());
    };
    RCSDK.prototype.getContactHelper = function () {
        return contactHelper.$get(this.getContext());
    };
    RCSDK.prototype.getContactGroupHelper = function () {
        return contactGroupHelper.$get(this.getContext());
    };
    RCSDK.prototype.getDeviceHelper = function () {
        return deviceHelper.$get(this.getContext());
    };
    RCSDK.prototype.getExtensionHelper = function () {
        return extensionHelper.$get(this.getContext());
    };
    RCSDK.prototype.getForwardingNumberHelper = function () {
        return forwardingNumberHelper.$get(this.getContext());
    };
    RCSDK.prototype.getMessageHelper = function () {
        return messageHelper.$get(this.getContext());
    };
    RCSDK.prototype.getPhoneNumberHelper = function () {
        return phoneNumberHelper.$get(this.getContext());
    };
    RCSDK.prototype.getPresenceHelper = function () {
        return presenceHelper.$get(this.getContext());
    };
    RCSDK.prototype.getRingoutHelper = function () {
        return ringoutHelper.$get(this.getContext());
    };
    RCSDK.prototype.getServiceHelper = function () {
        return serviceHelper.$get(this.getContext());
    };
    RCSDK.version = '1.2.1';
    return RCSDK;
})();
exports.RCSDK = RCSDK;
function factory(injections) {
    if (!injections || !('CryptoJS' in injections) || !('localStorage' in injections) || !('Promise' in injections) || !('PUBNUB' in injections) || !('XHR' in injections))
        throw new Error('Injections object is not complete');
    return RCSDK.setInjections(injections);
}
exports.factory = factory;
