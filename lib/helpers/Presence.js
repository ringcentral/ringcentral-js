define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        Utils = require('../core/Utils');

    /**
     * @extends Helper
     * @constructor
     */
    function PresenceHelper(context) {
        Helper.call(this, context);
        this.extension = require('./Extension').$get(context);
    }

    PresenceHelper.prototype = Object.create(Helper.prototype);

    /**
     * @param {IPresenceOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    PresenceHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~/extension/' + (id || '~') + '/presence' + (options.detailed ? '?detailedTelephonyState=true' : '');

    };

    /**
     * @param {IPresence} presence
     * @returns {string}
     */
    PresenceHelper.prototype.getId = function(presence) {
        return presence && (this.extension.getId(presence.extension) || presence.extensionId);
    };

    /**
     * @param {IPresence} presence
     * @returns {boolean}
     */
    PresenceHelper.prototype.isAvailable = function(presence) {
        return presence && presence.presenceStatus == 'Available';
    };

    /**
     * @param {IPresenceOptions} [options]
     * @param {string} [id]
     * @returns {Subscription}
     */
    PresenceHelper.prototype.getSubscription = function(options, id) {

        return require('../core/Subscription').$get(this.context).setEvents([this.createUrl(options, id)]);

    };

    /**
     *
     * @param {Subscription} subscription
     * @param {IPresence[]} presences
     * @param {IPresenceOptions} options
     * @returns {*}
     */
    PresenceHelper.prototype.updateSubscription = function(subscription, presences, options) {

        var events = presences.map(this.getId, this).map(function(id) {
            return this.createUrl(options, id);
        }, this);

        subscription.addEvents(events);

        return subscription;

    };

    /**
     * @param {IExtension[]} extensions
     * @param {IPresence[]} presences
     * @param {bool} [merge]
     * @returns {*}
     */
    PresenceHelper.prototype.attachToExtensions = function(extensions, presences, merge) {

        var index = this.index(presences);

        extensions.forEach(/** @param {IExtension} extension */ function(extension) {

            var presence = index[this.extension.getId(extension)];

            if (presence) {
                if ('presence' in extension && merge) {
                    Utils.extend(extension.presence, presence);
                } else {
                    extension.presence = presence;
                }
            }

        }, this);

    };

    /**
     * @param {IPresenceCall} presenceCall
     * @returns {boolean}
     */
    PresenceHelper.prototype.isCallInProgress = function(presenceCall) {
        return (presenceCall && presenceCall.telephonyStatus != 'NoCall');
    };

    module.exports = {
        Class: PresenceHelper,
        /**
         * @param {Context} context
         * @returns {PresenceHelper}
         */
        $get: function(context) {

            return context.createSingleton('PresenceHelper', function() {
                return new PresenceHelper(context);
            });

        }
    };

    /**
     * @typedef {Object} IPresence
     * @property {IExtension} extension
     * @property {IPresenceCall[]} activeCalls
     * @property {string} presenceStatus - Offline, Busy, Available
     * @property {string} telephonyStatus - NoCall, CallConnected, Ringing, OnHold
     * @property {string} userStatus - Offline, Busy, Available
     * @property {string} dndStatus - TakeAllCalls, DoNotAcceptAnyCalls, DoNotAcceptDepartmentCalls, TakeDepartmentCallsOnly
     * @property {boolean} allowSeeMyPresence
     * @property {boolean} ringOnMonitoredCall
     * @property {boolean} pickUpCallsOnHold
     * @property {number} extensionId
     * @property {number} sequence
     */

    /**
     * @typedef {Object} IPresenceCall
     * @property {string} direction
     * @property {string} from
     * @property {string} to
     * @property {string} sessionId
     * @property {string} id
     * @property {string} telephonyStatus
     */

    /**
     * @typedef {Object} IPresenceOptions
     * @property {boolean} detailed
     */

});
