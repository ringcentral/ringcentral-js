function encodeURIComponentWithUndefined(value) {
    return typeof value === 'undefined' ? '' : encodeURIComponent(value);
}

export function objectToUrlParams(obj) {
    return Object.keys(obj)
        .map(key => {
            if (Array.isArray(obj[key])) {
                return obj[key]
                    .map(value => encodeURIComponent(key) + '=' + encodeURIComponentWithUndefined(value))
                    .join('&');
            }
            return encodeURIComponent(key) + '=' + encodeURIComponentWithUndefined(obj[key]);
        })
        .join('&');
}
