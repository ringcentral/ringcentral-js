[![TravisCI Status](https://travis-ci.org/ringcentral/ringcentral-js.svg?branch=master)](https://travis-ci.org/ringcentral/ringcentral-js)
[![Coverage Status](https://coveralls.io/repos/github/ringcentral/ringcentral-js/badge.svg?branch=master)](https://coveralls.io/github/ringcentral/ringcentral-js)
[![Chat](https://img.shields.io/badge/chat-on%20glip-orange.svg)](https://glipped.herokuapp.com/)

# Packages

- [SDK](sdk) &mdash; Main SDK package, interacts with RingCentral REST API
- [Subscriptions SDK](subscriptions) &mdash; Additional SDK which listens to push notifications

***

# Key Benefits

- Automatically handles token lifecycle procedures in multi-tab environment
- Re-issues non-authorized requests
- Decrypts PubNub notification messages
- Parses multipart API responses
- Restores subscriptions from cache
- Automatically re-subscribes in case of subscription renewal errors
- Compatible with latest WhatWG `fetch()` spec (DOM `Request`s and `Response`s)

***

# Migration from previous releases

**!!! Attention !!!**

**In SDK version 2.0 Helpers were moved to separate repository: [ringcentral-js-helpers](https://github.com/ringcentral/ringcentral-js-helpers).**

A lot of code improvements were implemented in order to make SDK compatible with WhatWG Fetch, DOM Requests &
DOM Responses: see [full list of migration instructions](../../CHANGELOG.md).
  