define(function(require, exports, module) {

    'use strict';

    var Helper = require('../core/Helper').Class,
        List = require('../core/List'),
        Utils = require('../core/Utils');

    /**
     * @extends Helper
     * @constructor
     */
    function ExtensionHelper(context) {
        Helper.call(this, context);
    }

    ExtensionHelper.prototype = Object.create(Helper.prototype);

    ExtensionHelper.prototype.type = {
        department: 'Department',
        user: 'User',
        announcement: 'Announcement',
        voicemail: 'Voicemail'
    };

    /**
     *
     * @param {IExtensionOptions} [options]
     * @param {string} [id]
     * @returns {string}
     */
    ExtensionHelper.prototype.createUrl = function(options, id) {

        options = options || {};

        return '/account/~' +
               (options.departmentId ? '/department/' + options.departmentId + '/members' : '/extension') +
               (id ? '/' + id : '');

    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isUser = function(extension) {
        return extension && extension.type == this.type.user;
    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isDepartment = function(extension) {
        return extension && extension.type == this.type.department;
    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isAnnouncement = function(extension) {
        return extension && extension.type == this.type.announcement;
    };

    /**
     * @param {IExtension} extension
     * @returns {boolean}
     */
    ExtensionHelper.prototype.isVoicemail = function(extension) {
        return extension && extension.type == this.type.voicemail;
    };

    /**
     * @param {IListComparatorOptions} [options]
     * @returns {function(object, object)}
     */
    ExtensionHelper.prototype.comparator = function(options) {

        return List.comparator(Utils.extend({
            sortBy: 'extensionNumber',
            compareFn: List.numberComparator
        }, options));

    };

    /**
     * @param {IExtensionFilterOptions} [options]
     * @returns {function(IExtension)}
     */
    ExtensionHelper.prototype.filter = function(options) {

        options = Utils.extend({
            search: '',
            type: ''
        }, options);

        return List.filter([
            {filterBy: 'type', condition: options.type},
            {
                condition: options.search.toLocaleLowerCase(),
                filterFn: List.containsFilter,
                extractFn: function(item) {
                    return (item.name && (item.name.toLocaleLowerCase() + ' ')) +
                           (item.extensionNumber && item.extensionNumber.toString().toLocaleLowerCase());
                }
            }
        ]);

    };

    module.exports = {
        Class: ExtensionHelper,
        /**
         * @param {Context} context
         * @returns {ExtensionHelper}
         */
        $get: function(context) {

            return context.createSingleton('ExtensionHelper', function() {
                return new ExtensionHelper(context);
            });

        }
    };

    /**
     * @typedef {object} IExtensionOptions
     * @property {string} departmentId
     */

    /**
     * @typedef {object} IExtensionFilterOptions
     * @property {string} search
     * @property {string} type
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ShortExtensionInfo
     * @typedef {object} IExtensionShort
     * @property {string} id
     * @property {string} uri
     * @property {string} extensionNumber
     */

    /**
     * @see http://platform-dev.dins.ru/artifacts/documentation/latest/webhelp/dev_guide_advanced/ch18s04.html#ExtensionInfo
     * @typedef {object} IExtension
     * @property {string} id
     * @property {string} uri
     * @property {string} extensionNumber
     * @property {string} name
     * @property {string} type
     * @property {IContactBrief} contact
     * @property {IExtensionRegionalSettings} regionalSettings
     * @property {IServiceFeature[]} serviceFeatures
     * @property {string} status
     * @property {string} setupWizardState
     */

    /**
     * @typedef {object} IExtensionRegionalSettings
     * @property {ITimezone} timezone
     * @property {ILanguage} language
     * @property {ICountry} homeCountry
     */

});
