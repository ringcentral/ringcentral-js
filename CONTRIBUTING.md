# Installation

For more info read the [GulpJS Getting Started guide](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#getting-started).

## 1. Get [NodeJS](http://nodejs.org/download)

## 2. Install NPM packages

In the directory where a local copy of the SDK is placed:

```
$ npm install
```

## 3. Install Bower

Bower is needed to run Karma tests.

```
$ npm install -g bower
```

## 4. Install Bower dependencies

```
$ bower install
```

# Building with GulpJS

Build schema:

```
        ┏━━━━━ webpack ━━━━┳━ sourcemap ━━┓
        ┃                  ┃              ┃
 clean ━╋━ webpack-bundle ━┛              ┣━ default
        ┃                                 ┃
        ┗━ tsc ━ wrap ━ jshint ━ version ━┛
```

## Regular build

```
$ npm run build
```

## Watch

```
$ npm run watch
```

or `watch-all` will include Webpack watchers.

***

# Tests

## Mocha (console)

```
$ npm test
```

## Karma (browser)

```
$ npm run karma [-- --no-single-run --auto-watch --log-level warn --browsers Chrome]
```

or use short-hands: `$ npm run karma-chrome` and `$ npm run karma-watch`.

## Coverage

```
$ npm run istanbul
```

***

# Development Guidelines

## Branching model

**Attention** Repository follows the [GitFlow branching model](http://nvie.com/posts/a-successful-git-branching-model).

## Always write a plain vanilla JavaScript

The SDK will be used in a variety of different third-party applications, which means it has to be written with the
lowest amount of dependencies. Please do not include anything external if there is no proper justification.

## Code structure

The SDK can be used in a Browser and NodeJS environment with no changes, so this applies a number of requirements
to the code base.

1. Every file must begin and end with a special Amdefine-RequireJS hybrid wrapping function
2. All ```define()``` statements must be written in CommonJS-compliant way, see
    [RequireJS Sugar section](http://requirejs.org/docs/whyamd.html#sugar)
3. During the build, first and last lines of code will be stripped so
    1. Code inside that wrapper function must be a valid CommonJS module
    2. No other code exists outside of the wrapper function
    3. Code must declare ```module.exports``` object, not simply return statement
5. NPM dependencies like CryptoJS and PUBNUB must be included in RequireJS config with appropriate paths matching NPM
    IDs ("crypto-js" for instance)
6. Pure prototype-based inheritance only
7. **Properly defined JSDOC is a strict requirement**

## Model Constructors

Most models may be serialized and de-serialized, and oftentimes the models' constructor will be called without
arguments, because serialized data will be populated. This means the model must not do anything in the constructor
(like loading, making AJAX requests, creating timeOut's and so on). The constructor must create only an empty (or almost
empty) instance.

## Spherical example class in vacuum

    ```js
    define(function(require, exports, module) {
    
        var Observable = require('../path/to/core/Observable').Clas;
    
        /**
         * Class declaration
         * @constructor
         * @extends Observable
         */
        YourClass() {
            Observable.call(this);
        }
    
        YourClass.prototype = Object.create(Observable.prototype); // set up inheritance
    
        YourClass.prototype.on = function() { // method declaration
            return Observable.prototype.on.apply(this, arguments); // call to the parent method
        }
    
        // The rest of your code here
    
        module.exports = {
            Class: YourClass,
            $get: function() { return new YourClass(); }
        }
    
    });
    ```

***

# Unit-test Guidelines

## Basic requirements

1. All AJAX interaction must be mocked
2. No direct SDK's method overrides in tests

## Mocks usage

Unit tests, that have to interact with Platform API server must have the following expression:

    ```js
    describe('RCSDK.messages.Filter', function() {
        Mock.registerHooks(this);
        // ...
    });
    ```

Unit tests, that modify somehow SDK-wide singletons must have the following expression:

    ```js
    describe('RCSDK.core.Platform', function() {
        Mock.registerCleanup(this);
        // ...
    });
    ```

In order to mock a certain AJAX request use Mock object:

    ```js
    rcsdk.getAjaxResponse.add({
        path: '/restapi/v1.0/account/~/extension/~/sms', // URL that will be substituted
        /**
         * This method returns the response from "server"
         * @param {AjaxMock} ajax
         * @param request
         * @returns {Object}
         */
        response: function(ajax) {
    
            return {...};
    
        },
        /**
         * This method is called to determine whether this mock is applied for pending request
         * @param {AjaxMock} ajax
         * @returns {boolean}
         */
        test: function(ajax){ return true; }
    });
    ```

## Mock Provider

Test suite includes a number of pre-configured mocks in ```./test/lib/mocks/``` directory. Please see the source.

## Spies

It is forbidden to use variables to determine, whether callback was executed or not. The following code IS NOT OK:

    ```js
    var wasCalled = false,
        callParameter = null;
        callback = function(e){ wasCalled = true; callParameter = e; };
    foo.bar({success: callback});
    expect(wasCalled).to.be.true;
    expect(callParameter).to.be.equal(...);
    ```

The way it should be done:

    ```js
    var spy = chai.spy(function(e){ expect(e).to.be.equal(...); }); // expectation in callback
    foo.bar({success: spy});
    expect(spy).to.be.called.once(); // expectation that spy was called
    ```

***

# API Tests 

These tests access real account on real production/staging servers. In order to make things happen a proper environment
variables have to be defined:

```
RCSDK_API_KEY=YOUR_API_KEY
RCSDK_API_SERVER=http://platform.ringcentral.com
RCSDK_AGS_SERVER=http://ags-server-host
RCSDK_AGS_DBNAME=database
```

Once ready run the following command:

```
$ npm run test-api
```

Environment variables may also be defined inline (substitute `(...)` with more vars):

```
$ RCSDK_API_KEY=YOUR_API_KEY (...) RCSDK_AGS_DBNAME=database npm run test-api
```

# Authentication Flow

![API Call Flow](http://habrastorage.org/files/308/78c/4d9/30878c4d9ee94a9d96fdefcaee5779ae.png)

# Tool Belt

1. [RequireJS](https://github.com/jrburke/requirejs) - RequireJS
2. [AMDClean](https://github.com/gfranko/amdclean)
3. [PUBNUB](http://pubnub.com)
4. CryptoJS
    1. [NPM version](https://npmjs.org/package/crypto-js) for backend
    2. [Bower version](https://github.com/sytelus/cryptojs) for frontend
5. [JSSip](http://jssip.net)
6. [TSD](http://definitelytyped.org/tsd)