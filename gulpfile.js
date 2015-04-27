/**
 * Build schema
 *
 *        ┏━━━━━ webpack ━━━━┳━ sourcemap ━━┓
 *        ┃                  ┃              ┃
 * clean ━╋━ webpack-bundle ━┛              ┣━ default
 *        ┃                                 ┃
 *        ┗━ tsc ━ wrap ━ jshint ━ version ━┛
 *
 * Watch tasks don't run jshint, version and default, the one must run full build befor commit
 *
 * For bold box drawings use https://www.branah.com/picker
 */
(function() {

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        sourcemaps = require('gulp-sourcemaps'),
        replace = require('gulp-replace'),
        ts = require('gulp-typescript'),
        tsProject = ts.createProject({
            declarationFiles: true,
            noExternalResolve: true,
            module: 'commonjs'
        }),
        sourcemapsDebug = false,
        webpackConfigure = {
            useMemoryFs: true,
            progress: false
        },
        webpackFormat = {
            version: true,
            timings: true
        },
        webpackFailAfter = {
            errors: true,
            warnings: true
        };

    gutil.log('Working directory:', gutil.colors.cyan(process.cwd()));

    function webpackCompile(bundle) {

        var webpack = require('gulp-webpack-build'),
            path = require('path'),
            config = bundle ? './webpack.config.bundle.js' : './webpack.config.js';

        gutil.log('Webpack config:', gutil.colors.cyan(config));

        return gulp.src(config, {base: path.resolve('./lib')})

            .pipe(webpack.configure(webpackConfigure))
            .pipe(webpack.compile())
            .pipe(webpack.format(webpackFormat))
            .pipe(webpack.failAfter(webpackFailAfter))
            .pipe(gulp.dest('./build'));

    }

    function webpackWatch(event, bundle) {

        var webpack = require('gulp-webpack-build'),
            path = require('path'),
            config = bundle ? 'webpack.config.bundle.js' : 'webpack.config.js';

        gutil.log('Webpack config:', gutil.colors.cyan(config));

        gulp.src(event.path, {base: path.resolve('./lib')})
            .pipe(webpack.closest(config))
            .pipe(webpack.configure(webpackConfigure))
            .pipe(webpack.watch(function(err, stats) {
                gulp.src(this.path, {base: this.base})
                    .pipe(webpack.proxy(err, stats))
                    .pipe(webpack.format(webpackFormat))
                    .pipe(gulp.dest('./build'));
            }));

    }

    /**
     * Cleans up build directory
     */
    gulp.task('clean', function() {

        var fs = require('fs'),
            extensions = ['.js', '.js.map', '.min.js', '.min.js.map'];

        extensions.forEach(function(ext) {
            var path = process.cwd() + '/build/rc-sdk' + ext;
            fs.existsSync(path) && fs.unlinkSync(path);
        });

    });

    /**
     * Compiles TypeScript modules into CommonJS modules in lib directory
     */
    gulp.task('tsc', ['clean'], function(cb) {

        var ts = require('gulp-typescript');

        return gulp.src(['./src/**/*.ts'])
            .pipe(ts(tsProject))
            .js.pipe(gulp.dest('.'));

    });

    /**
     * Wraps CommonJS modules in lib directory into
     */
    gulp.task('wrap', ['tsc'], function() {

        var wrap = require('gulp-wrap-js'),
            path = require('path');

        return gulp.src(['./lib/*/**/*.js', './lib/RCSDK.js', './lib/RCSDK-spec.js', './test/**/*.js'], {base: path.resolve('.')})
            .pipe(wrap([
                'var define = (typeof(define) === \'function\' && define.amd) ? define : function(factory) { factory(require, exports, module); };',
                'define(function(require, exports, module){%= body %})'
            ].join('\n')))
            .pipe(gulp.dest('.'));

    });

    /**
     * JSHints modules in lib directory
     */
    gulp.task('jshint', ['wrap'], function() {

        var jshint = require('gulp-jshint');

        return gulp.src(['./lib/**/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'))

    });

    /**
     * Propagates version from lib/RCSDK.js to package.json and bower.json
     */
    gulp.task('version', ['wrap'], function() {

        return gulp.src(['./bower.json', './package.json'])
            .pipe(replace(/"version": "[^"]+?"/ig, '"version": "' + require('./lib/RCSDK').version + '"'))
            .pipe(gulp.dest('.'));

    });

    /**
     * Compiles TypeScript modules into a Webpack bundle (including external dependencies CryptoJS, Promise and PUBNUB)
     */
    gulp.task('webpack', ['clean'], function() {

        return webpackCompile(false);

    });

    /**
     * Compiles TypeScript modules into a Webpack build
     */
    gulp.task('webpack-bundle', ['clean'], function() {

        return webpackCompile(true);

    });

    /**
     * Replaces Webpack stuff in source map files
     */
    gulp.task('sourcemap', ['webpack', 'webpack-bundle'], function() {

        return gulp.src(['./build/rc-sdk.js.map', './build/rc-sdk-bundle.js.map'])
            .pipe(replace(/webpack:\/\/\//g, ''))
            .pipe(replace(/(.\/src\/)/g, '.$1'))
            .pipe(gulp.dest('./build'));

    });

    /**
     * Minifies build and bundle
     */
    gulp.task('default', ['version', 'sourcemap'], function() {

        var uglify = require('gulp-uglify'),
            rename = require('gulp-rename');

        return gulp.src(['./build/rc-sdk.js', './build/rc-sdk-bundle.js'])
            .pipe(sourcemaps.init({loadMaps: true, debug: sourcemapsDebug}))

            .pipe(uglify())

            .pipe(rename({suffix: '.min'}))

            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest('./build'));

    });

    /**
     * Quick watch procedure, only wrapped CommonJS modules, good for rapid development
     */
    gulp.task('watch', ['wrap'], function() {

        gulp.watch('./src/**/*.ts', ['wrap']);

    });

    /**
     * Quick watch + Webpack watch
     */
    gulp.task('watch-all', ['wrap', 'webpack', 'webpack-bundle'], function() {

        gulp.watch('./src/**/*.ts', ['wrap']).on('change', function(event) {

            //gutil.log(gutil.template('File <%= file %> was <%= type %>, running tasks', {file: gutil.colors.magenta(event.path), type: event.type}));

            if (event.type === 'changed') {
                webpackWatch(event, true);
                webpackWatch(event, false);
            }
        });

    });

})();