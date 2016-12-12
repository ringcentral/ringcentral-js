# Builds

```
$ npm run build
$ npm run watch
```

# Tests

## Full test

```
$ npm test
```

## Mocha (NodeJS)

```
$ npm run mocha
$ npm run mocha-watch
$ npm run istanbul
```

## Karma (browser)

```
$ npm run karma
$ npm run karma-watch
$ npm run karma-webpack
$ npm run karma-webpack-watch
```

***

# Development Guidelines

## Branching model

**Attention** Repository follows the [GitHub Flow](https://guides.github.com/introduction/flow/).

## Always write a plain vanilla JavaScript

The SDK will be used in a variety of different third-party applications, which means it has to be written with the
lowest amount of dependencies. Please do not include anything external if there is no proper justification.

# Unit-test Guidelines

## Basic requirements

1. All AJAX interaction must be mocked
2. No direct SDK's method overrides in tests

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