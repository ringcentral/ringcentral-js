(function() {

    /** @type {gulp.Gulp} */
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        sourcemaps = require('gulp-sourcemaps'),
        path = require('path'),
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

    /**
     * Compiles TypeScript modules into a Webpack bundle (including external dependencies CryptoJS, Promise and PUBNUB)
     * TODO TypeScript cache
     * TODO Export definitions
     */
    gulp.task('webpack', [], function() {

        var webpack = require('gulp-webpack-build');

        return gulp.src('./webpack.config.js', {base: path.resolve('./build')})

            .pipe(webpack.init(webpackConfigure))
            .pipe(webpack.run())
            .pipe(webpack.format(webpackFormat))
            .pipe(webpack.failAfter(webpackFailAfter))
            .pipe(gulp.dest('./build'));

    });

    /**
     * Replaces Webpack stuff in source map files
     */
    gulp.task('sourcemap', ['webpack'], function() {

        var replace = require('gulp-replace');

        return gulp.src(['./build/rc-sdk.js.map', './build/rc-sdk-bundle.js.map'])
            .pipe(replace(/webpack:\/\/\//g, ''))
            .pipe(replace(/(\.\.\/src\/)/g, '.$1'))
            .pipe(gulp.dest('./build'));

    });

    /**
     * Minifies build and bundle
     */
    gulp.task('uglify', ['sourcemap'], function() {

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
     * Propagates version number to package.json and bower.json
     */
    gulp.task('version', ['webpack'], function(cb) {

        var fs = require('fs'),
            pkg = require('./package.json'),
            bower = require('./bower.json'),
            version = require('./build/rc-sdk').version;

        pkg.version = version;
        bower.version = version;

        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
        fs.writeFileSync('./bower.json', JSON.stringify(bower, null, 2));

        gutil.log('Current version is', gutil.colors.magenta(version));

        cb();

    });

    /**
     * Default Task
     */
    gulp.task('default', ['uglify', 'version']);

    /**
     * Watch Task
     *
     * (!) This will not run version and sourcemap, the one must run full build before commit
     */
    gulp.task('watch', ['webpack'], function() {

        var webpack = require('gulp-webpack-build');

        gulp.watch('./src/**/*.ts').on('change', function(event) {

            gutil.log('File', gutil.colors.magenta(event.path), 'was', event.type);

            if (event.type === 'changed') {

                gulp.src(event.path, {base: path.resolve('./build')})
                    .pipe(webpack.closest('webpack.config.js'))
                    .pipe(webpack.init(webpackConfigure))
                    .pipe(webpack.watch(function(err, stats) {
                        gulp.src(this.path, {base: this.base})
                            .pipe(webpack.proxy(err, stats))
                            .pipe(webpack.format(webpackFormat))
                            .pipe(gulp.dest('./build'));
                    }));

            }
        });

    });

})();