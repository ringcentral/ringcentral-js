import {apiCall, asyncTest, expect} from '../test/test';
import {PreMiddleware, PostMiddleware, ErrorMiddleware} from './middleware';

const globalAny: any = global;
const windowAny: any = typeof window !== 'undefined' ? window : global;

describe('RingCentral.platform.middleware', () => {
    describe('PreMiddleware', () => {
        it(
            'will enhance the request config before send the request',
            asyncTest(async sdk => {
                const preMiddleware: PreMiddleware = request => {
                    request.headers.append('custom-value', 'RC');
                    return request;
                };
                const platform = sdk.platform();
                const customValue = await platform
                    .send({
                        url: 'http://whatever/test/test',
                        method: 'GET',
                        middlewares: [{pre: preMiddleware}],
                    })
                    .catch(error => {
                        return error.request.headers.get('custom-value');
                    });
                expect(customValue).to.equal('RC');
            }),
        );
        it(
            'will enhance the request config twice before send the request',
            asyncTest(async sdk => {
                const preMiddleware1: PreMiddleware = request => {
                    request.headers.append('custom-value1', 'RC1');
                    return request;
                };
                const preMiddleware2: PreMiddleware = request => {
                    request.headers.append('custom-value2', 'RC2');
                    return request;
                };
                const platform = sdk.platform();
                const customValue = await platform
                    .send({
                        url: 'http://whatever/test/test',
                        method: 'GET',
                        middlewares: [{pre: preMiddleware1}, {pre: preMiddleware2}],
                    })
                    .catch(error => {
                        return `${error.request.headers.get('custom-value1')} - ${error.request.headers.get(
                            'custom-value2',
                        )}`;
                    });
                expect(customValue).to.equal('RC1 - RC2');
            }),
        );
    });

    describe('PostMiddleware', () => {
        it(
            'will enhance the response after the request was success',
            asyncTest(async sdk => {
                apiCall('GET', '/test/test', {name: 'RC'}, 200);
                const postMiddleware: PostMiddleware = response => {
                    return response.json() as any;
                };
                const platform = sdk.platform();
                const response = await platform.send({
                    url: 'http://whatever/test/test',
                    method: 'GET',
                    middlewares: [{post: postMiddleware}],
                    skipAuthCheck: true,
                    skipDiscoveryCheck: true,
                });
                expect(JSON.stringify(response)).to.equal(JSON.stringify({name: 'RC'}));
            }),
        );
        it(
            'will enhance the response twice after the request was success',
            asyncTest(async sdk => {
                apiCall('GET', '/test/test', {name: 'RC'}, 200);
                const postMiddleware1: PostMiddleware = response => {
                    return response.json() as any;
                };
                const postMiddleware2: PostMiddleware = response => {
                    return (response as any).name as any;
                };
                const platform = sdk.platform();
                const response = await platform.send({
                    url: 'http://whatever/test/test',
                    method: 'GET',
                    middlewares: [{post: postMiddleware1}, {post: postMiddleware2}],
                    skipAuthCheck: true,
                    skipDiscoveryCheck: true,
                });
                expect(response).to.equal('RC');
            }),
        );
    });

    describe('ErrorMiddleware', () => {
        it(
            'will enhance the error after the request was failed',
            asyncTest(async sdk => {
                const errorMiddleware: ErrorMiddleware = error => {
                    error.message = 'RC';
                    return error;
                };
                const platform = sdk.platform();
                const customValue = await platform
                    .send({
                        url: 'http://whatever/test/test',
                        method: 'GET',
                        middlewares: [{error: errorMiddleware}],
                    })
                    .catch(error => {
                        return error.message;
                    });
                expect(customValue).to.equal('RC');
            }),
        );

        it(
            'will enhance the error twice after the request was failed',
            asyncTest(async sdk => {
                const errorMiddleware1: ErrorMiddleware = error => {
                    error.message = 'RC';
                    return error;
                };
                const errorMiddleware2: ErrorMiddleware = error => {
                    return error.message;
                };
                const platform = sdk.platform();
                const customValue = await platform
                    .send({
                        url: 'http://whatever/test/test',
                        method: 'GET',
                        middlewares: [{error: errorMiddleware1}, {error: errorMiddleware2}],
                    })
                    .catch(error => error);
                expect(customValue).to.equal('RC');
            }),
        );
    });

    describe('PostMiddleware & ErrorMiddleware', () => {
        it(
            'will goto error middleware if there are some errors in the post middlewares',
            asyncTest(async sdk => {
                apiCall('GET', '/test/test', {name: 'RC'}, 200);
                const postMiddleware: PostMiddleware = _response => {
                    throw new Error('RC');
                };
                const errorMiddleware: ErrorMiddleware = error => {
                    return error.message;
                };
                const platform = sdk.platform();
                const response = await platform
                    .send({
                        url: 'http://whatever/test/test',
                        method: 'GET',
                        middlewares: [{post: postMiddleware, error: errorMiddleware}],
                        skipAuthCheck: true,
                        skipDiscoveryCheck: true,
                    })
                    .catch(error => error);
                expect(response).to.equal('RC');
            }),
        );
    });
});
