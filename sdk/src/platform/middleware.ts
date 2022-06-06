export interface PreMiddleware {
    (request: Request): Promise<Request> | Request;
}

export interface PostMiddleware {
    (response: Response | any): Promise<any> | any;
}

export interface ErrorMiddleware {
    (error: Error | any): Promise<any> | any;
}

export interface Middleware {
    pre?: PreMiddleware;
    post?: PostMiddleware;
    error?: ErrorMiddleware;
}

export function executeMiddlewaresInSerial<T>(middlewares: ((opts: T) => Promise<T> | T)[], opts: T) {
    return middlewares.reduce((acc, middleware) => {
        return acc.then(middleware);
    }, Promise.resolve(opts));
}

export function executePreMiddlewaresInSerial(middlewares: PreMiddleware[], request: Request) {
    return executeMiddlewaresInSerial(middlewares, request);
}

export function executePostMiddlewaresInSerial(middlewares: PostMiddleware[], response: Response) {
    return executeMiddlewaresInSerial(middlewares, response);
}

export function executeErrorMiddlewaresInSerial(middlewares: ErrorMiddleware[], error: Error) {
    return executeMiddlewaresInSerial(middlewares, error);
}

export function parseMiddlewares(middlewares: Middleware[]) {
    const preMiddlewares: PreMiddleware[] = [];
    const postMiddlewares: PostMiddleware[] = [];
    const errorMiddlewares: ErrorMiddleware[] = [];
    for (const middleware of middlewares) {
        middleware.pre && preMiddlewares.push(middleware.pre);
        middleware.post && postMiddlewares.push(middleware.post);
        middleware.error && errorMiddlewares.push(middleware.error);
    }
    return {preMiddlewares, postMiddlewares, errorMiddlewares};
}
