module.exports = function override (config, env) {
    const loaders = config.resolve
    loaders.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve('stream-browserify'),
    };
    return config;
}
