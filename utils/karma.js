function createConfig(config, cwd) {
    let specs = [{pattern: './src/**/!(env).ts', watched: false}];

    return {
        basePath: '.',

        frameworks: ['mocha', 'chai', 'sinon-chai', 'karma-typescript'],

        files: [
            require.resolve('fetch-mock/dist/es5/client-bundle'),
            require.resolve('karma-chai-plugins/function-bind-polyfill'),
        ].concat(specs),

        reporters: ['karma-typescript', 'mocha'],

        htmlReporter: {
            outputDir: './coverage/karma',
        },

        coverageReporter: {
            type: 'lcov',
            dir: './coverage/karma',
        },

        logLevel: config.LOG_WARN,

        preprocessors: {
            './src/**/*.ts': ['karma-typescript'],
        },

        browsers: [process.env.CI || process.env.TRAVIS ? 'ChromeTravis' : 'Chrome', 'Firefox', 'Headless'],

        plugins: [
            require.resolve('karma-chai-plugins'),
            require.resolve('karma-chrome-launcher'),
            require.resolve('karma-firefox-launcher'),
            require.resolve('karma-mocha'),
            require.resolve('karma-mocha-reporter'),
            require.resolve('karma-typescript'),
        ],

        customLaunchers: {
            Headless: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox'],
            },
            ChromeTravis: {
                base: 'Chrome',
                flags: ['--no-sandbox'],
            },
        },

        client: {
            captureConsole: true,
            showDebugMessages: true,
            mocha: {
                ui: 'bdd',
                timeout: 5000,
            },
        },

        karmaTypescriptConfig: {
            tsconfig: 'tsconfig.json',
            bundlerOptions: {
                ignore: ['fetch-mock/es5/server'],
                resolve: {
                    directories: [__dirname + '/node_modules', __dirname + '/../node_modules', cwd + '/node_modules'],
                },
            },
        },

        singleRun: true,
    };
}

module.exports = createConfig;
