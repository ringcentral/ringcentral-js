# RingCentral JavaScript SDK

[![Build Status](https://github.com/ringcentral/ringcentral-js/workflows/CI%20Pipeline/badge.svg?branch=master)](https://github.com/ringcentral/ringcentral-js/actions)
[![Coverage Status](https://coveralls.io/repos/github/ringcentral/ringcentral-js/badge.svg?branch=master)](https://coveralls.io/github/ringcentral/ringcentral-js)
[![Chat](https://img.shields.io/badge/chat-on%20glip-orange.svg)](https://ringcentral.github.io/join-ringcentral/)
[![Twitter](https://img.shields.io/twitter/follow/ringcentraldevs.svg?style=social&label=follow)](https://twitter.com/RingCentralDevs)

The RingCentral Javascript SDK allows developers building client and server-side javascript applications to interface with the following RingCentral APIs more easily:

* [Voice](https://developer.ringcentral.com/api-products/voice)
* [Messaging](https://developer.ringcentral.com/api-products/sms), e.g. Fax, SMS, voicemail, etc.
* [Glip Team Messaging](https://developer.ringcentral.com/api-products/team-messaging)
* [Call Management](https://developer.ringcentral.com/api-products/configuration)
* [Meetings](https://developers.ringcentral.com/api-products/meetings)

## What's in this repository/SDK?

This SDK contains two components useful to developers. They are:

- [SDK](sdk) &mdash; Main SDK package, interacts with RingCentral REST API
- [Subscriptions SDK](subscriptions) &mdash; Additional SDK which listens to push notifications

## Are you a first-time RingCentral Developer?

If this is your first time building a RingCentral application, we recommend you get started online using our SMS Quick Start guide which will help you get up-and-running in minutes.

* [Get Started Using RingCentral &raquo;](https://developers.ringcentral.com/guide/sms/quick-start)

## Additional Resources

* [RingCentral Developer Guide](https://developer.ringcentral.com/api-reference) - a comprehensive set of tutorials to help developers build their first application and to evolve existing applications on the platform. 

* [RingCentral API Reference](https://developer.ringcentral.com/api-reference) - an interactive reference for the RingCentral API that allows developers to make API calls with no code.

You are viewing documentation for upcoming `4.0.0` release. Follow [this link to see 3.x.x documentation](https://github.com/ringcentral/ringcentral-js/tree/v3).  

## Running Demos in this SDK

In this SDK are a number of sample/demo applications. Each of these demo apps require you to create a `.env` file with the following contents:

```
BROWSER=false
SKIP_PREFLIGHT_CHECK=true

DEMO_PORT=3000
REACT_DEMO_PORT=3030
REDUX_DEMO_PORT=3033

REACT_APP_API_SERVER=https://platform.devtest.ringcentral.com
REACT_APP_API_CLIENT_ID=XXX
```

**Be sure to replace "XXX" with your app's Client ID.**

## Getting help and support

If you are having difficulty using this SDK, or working with the RingCentral API, please visit our [developer community forums](https://community.ringcentral.com/spaces/144/) for help and to get quick answers to your questions. If you wish to contact the RingCentral Developer Support team directly, please [submit a help ticket](https://developers.ringcentral.com/support/create-case) from our developer website.

## About RingCentral

RingCentral is a leading provider of global enterprise cloud communications and collaboration solutions. More flexible and cost-effective than legacy on-premises systems, RingCentral empowers modern mobile and distributed workforces to communicate, collaborate, and connect from any location, on any device and via any mode. RingCentral provides unified voice, video, team messaging and collaboration, conferencing, online meetings, digital customer engagement and integrated contact center solutions for enterprises globally. RingCentral’s open platform integrates with leading business apps and enables customers to easily customize business workflows.
