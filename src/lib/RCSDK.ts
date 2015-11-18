/// <reference path="../typings/externals.d.ts" />

declare var require:(name:string)=>any;

import headers = require('./core/http/Headers');
import request = require('./core/http/Request');
import response = require('./core/http/Response');
import pubnubMock = require('./core/pubnub/PubnubMock');
import xhrMock = require('./core/xhr/XhrMock');
import xhrResponse = require('./core/xhr/XhrResponse');
import ajaxObserver = require('./core/AjaxObserver');
import cache = require('./core/Cache');
import context = require('./core/Context');
import helper = require('./core/Helper');
import list = require('./core/List');
import log = require('./core/Log');
import observable = require('./core/Observable');
import pageVisibility = require('./core/PageVisibility');
import platform = require('./core/Platform');
import subscription = require('./core/Subscription');
import utils = require('./core/Utils');
import validator = require('./core/Validator');

import accountHelper = require('./helpers/Account');
import blockedNumberHelper = require('./helpers/BlockedNumber');
import callHelper = require('./helpers/Call');
import contactHelper = require('./helpers/Contact');
import contactGroupHelper = require('./helpers/ContactGroup');
import conferencingHelper = require('./helpers/Conferencing');
import countryHelper = require('./helpers/Country');
import deviceHelper = require('./helpers/Device');
import deviceModelHelper = require('./helpers/DeviceModel');
import extensionHelper = require('./helpers/Extension');
import forwardingNumberHelper = require('./helpers/ForwardingNumber');
import languageHelper = require('./helpers/Language');
import locationHelper = require('./helpers/Location');
import messageHelper = require('./helpers/Message');
import phoneNumberHelper = require('./helpers/PhoneNumber');
import presenceHelper = require('./helpers/Presence');
import ringoutHelper = require('./helpers/Ringout');
import serviceHelper = require('./helpers/Service');
import shippingMethodHelper = require('./helpers/ShippingMethod');
import stateHelper = require('./helpers/State');
import timezoneHelper = require('./helpers/Timezone');

import promise = require('es6-promise');
import pubnub = require('pubnub');

class RCSDK {

    public static version = '1.3.2';

    public static url = {
        sandbox: 'https://platform.devtest.ringcentral.com',
        production: 'https://platform.ringcentral.com'
    };

    private static injections = <context.IInjections>{
        localStorage: (typeof(localStorage) !== 'undefined'
            ? localStorage
            : require('dom-' + 'storage')), // Node only
        Promise: typeof(Promise) !== 'undefined' ? Promise : (promise.Promise || promise),
        PUBNUB: pubnub,
        XHR: () => {
            try { return new XMLHttpRequest(); } catch (e) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
            try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
            try { return new (require('xhr' + '2'))(); } catch (e4) {} // Node only
            throw new Error("This browser does not support XMLHttpRequest.");
        },
        pubnubMock: pubnubMock,
        xhrMock: xhrMock
    };

    private _context:context.Context;

    constructor(options?:{
        server:string;
        appKey:string;
        appSecret:string;
        cachePrefix?:string;
    }) {

        options = options || <any>{};

        this._context = context.$get(RCSDK.injections);

        this.getCache()
            .setPrefix(options.cachePrefix || '');

        this.getPlatform()
            .setServer(options.server || '')
            .setCredentials(options.appKey || '', options.appSecret || '');

        //TODO Link Platform events with Subscriptions and the rest

    }

    // Internals

    getContext() { return this._context; }

    // Core

    getAjaxObserver() { return ajaxObserver.$get(this.getContext()); }

    getXhrResponse() { return xhrResponse.$get(this.getContext()); }

    getPlatform() { return platform.$get(this.getContext()); }

    getCache() { return cache.$get(this.getContext()); }

    getSubscription() { return subscription.$get(this.getContext()); }

    getPageVisibility() { return pageVisibility.$get(this.getContext()); }

    getHelper() { return helper.$get(this.getContext()); }

    getObservable() { return observable.$get(this.getContext()); }

    getValidator() { return validator.$get(this.getContext()); }

    getLog() { return log.$get(this.getContext()); }

    getUtils() { return utils.$get(this.getContext()); }

    getList() { return list.$get(this.getContext()); }

    // Helpers

    getCountryHelper() { return countryHelper.$get(this.getContext()); }

    getDeviceModelHelper() { return deviceModelHelper.$get(this.getContext()); }

    getLanguageHelper() { return languageHelper.$get(this.getContext()); }

    getLocationHelper() { return locationHelper.$get(this.getContext()); }

    getShippingMethodHelper() { return shippingMethodHelper.$get(this.getContext()); }

    getStateHelper() { return stateHelper.$get(this.getContext()); }

    getTimezoneHelper() { return timezoneHelper.$get(this.getContext()); }

    getAccountHelper() { return accountHelper.$get(this.getContext()); }

    getBlockedNumberHelper() { return blockedNumberHelper.$get(this.getContext()); }

    getCallHelper() { return callHelper.$get(this.getContext()); }

    getConferencingHelper() { return conferencingHelper.$get(this.getContext()); }

    getContactHelper() { return contactHelper.$get(this.getContext()); }

    getContactGroupHelper() { return contactGroupHelper.$get(this.getContext()); }

    getDeviceHelper() { return deviceHelper.$get(this.getContext()); }

    getExtensionHelper() { return extensionHelper.$get(this.getContext()); }

    getForwardingNumberHelper() { return forwardingNumberHelper.$get(this.getContext()); }

    getMessageHelper() { return messageHelper.$get(this.getContext()); }

    getPhoneNumberHelper() { return phoneNumberHelper.$get(this.getContext()); }

    getPresenceHelper() { return presenceHelper.$get(this.getContext()); }

    getRingoutHelper() { return ringoutHelper.$get(this.getContext()); }

    getServiceHelper() { return serviceHelper.$get(this.getContext()); }

}

export = RCSDK;