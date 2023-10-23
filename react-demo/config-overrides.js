module.exports = function override (config, env) {
    const loaders = config.resolve
    loaders.fallback = {
        querystring: require.resolve('querystring-es3'),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve('stream-browserify'),
    };
    return config;
}
