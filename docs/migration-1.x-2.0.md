# Migration Guide 1.x to 2.0

Key differences:

- Helpers were moved to separate repository: [RingCentral JS Helpers](https://github.com/ringcentral/ringcentral-js-helpers).
- Root JS name has changed from `RCSDK` to `RingCentral`
- `AjaxObserver` functionality been moved to `Client`
- New network request and response objects `Ajax` and `AjaxError` classes share the same interface:
    - `ajax.getJson()` instead of `ajax.json`
    - `ajax.getResponses()` instead of `ajax.responses`
    - `ajax.getRequest()` and `ajax.getResponse()` to access to DOM Request and DOM Response accordingly
    - `ajax.getRequest().headers` and `ajax.getResponse().headers` should be used to access headers