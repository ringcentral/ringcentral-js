/// <reference path="../../typings/externals.d.ts" />

export import mocha = require('../../test/mocha');
var expect = mocha.chai.expect;
var spy = mocha.sinon.spy;
var mock = mocha.mock;
var rcsdk = mocha.rcsdk;

describe('RCSDK.helpers.Message', function() {

    'use strict';

    var Message = rcsdk.getMessageHelper();

    describe('attachContacts', function() {

        it('attaches contacts to all callerInfo structures found in each call', function() {

            var contacts = <any>[
                    {id: 'foo', homePhone: 'foo'},
                    {id: 'bar', homePhone: 'bar'},
                    {id: 'baz', homePhone: 'baz'}
                ],
                messages = <any>[
                    {
                        direction: 'Outbound',
                        from: {phoneNumber: 'foo'},
                        to: [
                            {phoneNumber: 'bar'},
                            {phoneNumber: 'baz'}
                        ]
                    },
                    {
                        direction: 'Inbound',
                        from: {phoneNumber: 'baz'},
                        to: [
                            {phoneNumber: 'notfound'}
                        ]
                    }
                ];

            Message.attachContacts(contacts, messages);

            expect(messages[0].from.contact).to.equal(contacts[0]);
            expect(messages[0].to[0].contact).to.equal(contacts[1]);
            expect(messages[0].to[1].contact).to.equal(contacts[2]);
            expect(messages[1].from.contact).to.equal(contacts[2]);
            expect(messages[1].to[0].contact).to.be.an('undefined');

        });

    });


    describe('getCallerInfo', function() {

        var messages = [
            {
                direction: 'Outbound',
                from: {
                    phoneNumber: 'foo'
                },
                to: [
                    {phoneNumber: 'bar'},
                    {phoneNumber: 'baz'}
                ]
            },
            {
                direction: 'Inbound',
                from: {phoneNumber: 'baz'},
                to: [
                    {phoneNumber: 'qux'}
                ]
            }
        ];

        it('returns callerInfo of from or to properties depending on direction', function() {

            expect(Message.getCallerInfos(messages[0]).length).to.equal(2);
            expect(Message.getCallerInfos(messages[0])[0].phoneNumber).to.equal('bar');
            expect(Message.getCallerInfos(messages[0])[1].phoneNumber).to.equal('baz');

            expect(Message.getCallerInfos(messages[1]).length).to.equal(1);
            expect(Message.getCallerInfos(messages[1])[0].phoneNumber).to.equal('baz');

        });

        it('returms all callerInfos in an order depending on direction', function() {

            expect(Message.getAllCallerInfos(messages[0]).length).to.equal(3);
            expect(Message.getAllCallerInfos(messages[0])[0].phoneNumber).to.equal('bar');
            expect(Message.getAllCallerInfos(messages[0])[1].phoneNumber).to.equal('baz');
            expect(Message.getAllCallerInfos(messages[0])[2].phoneNumber).to.equal('foo');

            expect(Message.getAllCallerInfos(messages[1]).length).to.equal(2);
            expect(Message.getAllCallerInfos(messages[1])[0].phoneNumber).to.equal('baz');
            expect(Message.getAllCallerInfos(messages[1])[1].phoneNumber).to.equal('qux');

        });

    });

    describe('shorten', function() {

        it('creates a short message out of full message structure', function() {

            var message = {
                    direction: 'Outbound',
                    subject: 'qux',
                    from: {
                        phoneNumber: 'foo'
                    },
                    to: [
                        {phoneNumber: 'bar'},
                        {phoneNumber: 'baz'}
                    ]
                },
                short = <any>Message.shorten(message);

            expect(short.direction).to.be.an('undefined');
            expect(short.subject).to.be.an('undefined');
            expect(short.text).to.equal(message.subject);
            expect(short.from).to.equal(message.from);
            expect(short.to).to.equal(message.to);

        });

    });

    describe('createUrl', function() {

        it('produces various urls depending on options', function() {

            expect(Message.createUrl()).to.equal('/account/~/extension/~/message-store');
            expect(Message.createUrl({}, 1)).to.equal('/account/~/extension/~/message-store/1');
            expect(Message.createUrl({extensionId: 'foo'}, '1')).to.equal('/account/~/extension/foo/message-store/1');
            expect(Message.createUrl({
                extensionId: 'foo',
                sync: true
            }, '1')).to.equal('/account/~/extension/foo/message-sync');
            expect(Message.createUrl({extensionId: 'foo', sms: true}, '1')).to.equal('/account/~/extension/foo/sms');
            expect(Message.createUrl({
                extensionId: 'foo',
                pager: true
            }, '1')).to.equal('/account/~/extension/foo/company-pager');

        });

    });

    describe('loadRequest, saveRequest, deleteRequest', function() {

        it('produces various urls depending on options', function() {

            expect(Message.loadRequest().url).to.equal('/account/~/extension/~/message-store');
            expect(Message.saveRequest({}).url).to.equal('/account/~/extension/~/message-store');

        });

    });

    describe('getAttachmentUrl & getAttachmentContentType', function() {

        mock.registerHooks(this);

        var platform = rcsdk.getPlatform(),
            message = {
                attachments: [
                    {
                        uri: '/account/~/extension/~/message-store/1/attachment/---1---',
                        contentType: 'foo'
                    },
                    {
                        uri: '/account/~/extension/~/message-store/1/attachment/---2---',
                        contentType: 'bar'
                    }
                ]
            };

        it('gives a wrapped donwloadable url, empty string if not found', function() {

            expect(Message.getAttachmentUrl(message, 0)).to.equal('http://whatever/restapi/v1.0/account/~/extension/~/message-store/1/attachment/---1---?_method=GET&access_token=' + platform.getToken());
            expect(Message.getAttachmentUrl(message, 1)).to.equal('http://whatever/restapi/v1.0/account/~/extension/~/message-store/1/attachment/---2---?_method=GET&access_token=' + platform.getToken());
            expect(Message.getAttachmentUrl(message, 2)).to.equal('');

        });

        it('gives a content type, empty string if not found', function() {

            expect(Message.getAttachmentContentType(message, 0)).to.equal('foo');
            expect(Message.getAttachmentContentType(message, 1)).to.equal('bar');
            expect(Message.getAttachmentContentType(message, 2)).to.equal('');

        });

    });

    describe('filter', function() {

        var messages = [
            {
                direction: 'Outbound',
                availability: 'Purged',
                readStatus: 'Read',
                conversationId: '1'
            },
            {
                direction: 'Inbound',
                availability: 'Deleted',
                readStatus: 'Read',
                conversationId: '1'
            },
            {
                direction: 'Outbound',
                availability: 'Alive',
                readStatus: 'Unread',
                conversationId: '2'
            },
            {
                direction: 'Outbound',
                availability: 'Alive',
                readStatus: 'Read',
                conversationId: '2',
                subject: 'foo bar baz'
            }
        ];

        it('rules out dead objects by default', function() {

            var filtered = messages.filter(Message.filter());

            expect(filtered.length).to.equal(2);
            expect(filtered[0]).to.equal(messages[2]);
            expect(filtered[1]).to.equal(messages[3]);

        });

        it('rules out objects by criteria', function() {

            var filtered;

            filtered = messages.filter(Message.filter({alive: false}));

            expect(filtered.length).to.equal(4);

            filtered = messages.filter(Message.filter({alive: false, direction: 'Inbound'}));

            expect(filtered.length).to.equal(1);
            expect(filtered[0]).to.equal(messages[1]);

            filtered = messages.filter(Message.filter({alive: false, readStatus: 'Read'}));

            expect(filtered.length).to.equal(3);
            expect(filtered[0]).to.equal(messages[0]);
            expect(filtered[1]).to.equal(messages[1]);
            expect(filtered[2]).to.equal(messages[3]);

            filtered = messages.filter(Message.filter({alive: false, conversationId: '2'}));

            expect(filtered.length).to.equal(2);
            expect(filtered[0]).to.equal(messages[2]);
            expect(filtered[1]).to.equal(messages[3]);

            filtered = messages.filter(Message.filter({search: 'bar'}));

            expect(filtered.length).to.equal(1);
            expect(filtered[0]).to.equal(messages[3]);

        });

    });

    describe('comparator', function() {

        it('sorts by creationTime', function() {

            var messages = [
                {creationTime: '2014-08-26T09:46:06.781Z'},
                {creationTime: '2014-08-26T08:46:06.781Z'},
                {creationTime: '2014-08-26T07:46:06.781Z'}
            ];

            var sorted = [].concat(messages).sort(Message.comparator());

            expect(sorted[0]).to.equal(messages[2]);
            expect(sorted[1]).to.equal(messages[1]);
            expect(sorted[2]).to.equal(messages[0]);

        });

    });

    describe('getSubscription', function() {

        it('returns pre-configured Subscription object', function() {

            var notificaction = Message.getSubscription({extensionId: 'foo'});

            expect(notificaction.eventFilters.length).to.equal(1);
            expect(notificaction.eventFilters[0]).to.equal('/account/~/extension/foo/message-store');

        });

    });

    describe('validate', function() {

        it('performs basic SmsMessage validation', function() {

            var res = Message.validateSMS({});

            expect(res.isValid).to.equal(false);
            expect(res.errors['to'][0]).to.be.instanceOf(Error);
            expect(res.errors['from'][0]).to.be.instanceOf(Error);
            expect(res.errors['subject'][0]).to.be.instanceOf(Error);

        });

        it('performs basic PagerMessage validation', function() {

            var res = Message.validatePager({});

            expect(res.isValid).to.equal(false);
            expect(res.errors['to'][0]).to.be.instanceOf(Error);
            expect(res.errors['from'][0]).to.be.instanceOf(Error);
            expect(res.errors['subject'][0]).to.be.instanceOf(Error);

        });

        it('passes SmsMessage validation if values are correct', function() {

            var res = Message.validateSMS({to: [{phoneNumber: 'foo'}], from: {phoneNumber: 'foo'}, subject: 'foo'});

            expect(res.isValid).to.equal(true);
            expect(res.errors).to.deep.equal({});

        });

        it('passes PagerMessage validation if values are correct', function() {

            var res = Message.validatePager(<any>{
                to: {extensionNumber: 'foo'},
                from: {extensionNumber: 'foo'},
                subject: 'foo'
            });

            expect(res.isValid).to.equal(true);
            expect(res.errors).to.deep.equal({});

        });

    });

});
