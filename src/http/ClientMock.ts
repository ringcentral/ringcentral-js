/// <reference path="../externals.d.ts" />
/// <reference path="../core/Utils.ts" />
/// <reference path="../core/Observable.ts" />
/// <reference path="../mocks/Registry.ts" />
/// <reference path="../externals/Externals.ts" />
/// <reference path="./ApiResponse.ts" />

module RingCentral.sdk.http {

    export class ClientMock extends Client {

        private _registry:mocks.Registry;

        constructor(registry:mocks.Registry) {
            super();
            this._registry = registry;
        }

        protected _loadResponse(request:Request):Promise<Response> {

            return new externals._Promise((resolve) => {

                core.log.debug('API REQUEST', request.method, request.url);

                var mock = this._registry.find(request);

                resolve(mock.getResponse(request));

            });

        }

    }

}