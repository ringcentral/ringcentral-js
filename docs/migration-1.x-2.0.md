# Migration Guide 1.x to 2.0

Key differences:

- Helpers were moved to separate repository: [RingCentral JS Helpers](https://github.com/ringcentral/ringcentral-js-helpers).
- Root JS name has changed from `RCSDK` to `RingCentral.SDK`
- `AjaxObserver` functionality been moved to `Client`
- New network request/response objects `ApiResponse` interface:
    - `apiResponse.json()` instead of `ajax.json`
    - `apiResponse.multipart()` instead of `ajax.responses`
    - `apiResponse.request()` and `ajax.response()` to access to DOM Request and DOM Response accordingly
    - `apiResponse.request().headers` and `ajax.response().headers` should be used to access headers
- `Subscription` interface changes