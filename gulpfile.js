(function() {

    /** @type {gulp.Gulp} */
    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        add = require('gulp-add'),
        concat = require('gulp-concat'),
        merge = require('merge2'),
        rename = require('gulp-rename'),
        sourcemaps = require('gulp-sourcemaps'),
        ts = require('gulp-typescript'),
        uglify = require('gulp-uglify'),
        wrap = require('gulp-wrap-js'),
        path = require('path'),
        fs = require('fs'),
        sourcemapsDebug = true,
        tsProject = ts.createProject('tsconfig.json', {sortOutput: true, noExternalResolve: true}), //, declarationFiles: true
        tsTestProject = ts.createProject({sortOutput: true});

    /**
     * Compiles SDK
     */
    gulp.task('typescript', function() {

        var result = gulp
            .src(['./src/**/!(*-spec|test).ts'])
            .pipe(sourcemaps.init({debug: sourcemapsDebug}))
            .pipe(ts(tsProject));


        return merge([
            result.dts
                .pipe(gulp.dest('.')),
            result.js
                .pipe(concat('ringcentral.js'))
                .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
                .pipe(gulp.dest('./build')),
            result.js
                .pipe(add({
                    './bower_components/es6-promise/promise.js': fs.readFileSync('./bower_components/es6-promise/promise.js').toString(),
                    './bower_components/fetch/fetch.js': fs.readFileSync('./bower_components/fetch/fetch.js').toString(),
                    './bower_components/pubnub/web/pubnub.js': fs.readFileSync('./bower_components/pubnub/web/pubnub.js').toString()
                }))
                .pipe(concat('ringcentral-bundle.js'))
                .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
                .pipe(gulp.dest('./build'))
        ]);

    });

    /**
     * Adds NodeJS module to definition
     */
    gulp.task('definition', ['typescript'], function() {

        var definition = fs.readFileSync('./build/ringcentral.d.ts').toString();

        definition += [
            'declare module "ringcentral" {',
            '    export = RingCentral;',
            '}'
        ].join('\n');

        fs.writeFileSync('./build/ringcentral.d.ts', definition);

    });

    /**
     * Compiles SDK Tests
     */
    gulp.task('tests', ['typescript', 'definition'], function() {

        return gulp
            .src(['./src/**/*-spec.ts', './src/test.ts'])
            .pipe(sourcemaps.init({debug: sourcemapsDebug}))
            .pipe(ts(tsTestProject))
            .js
            .pipe(concat('specs.js'))
            .pipe(wrap(fs.readFileSync('./utils/wrap-tests.js').toString().replace('/*{%= body %}*/', '%= body %')))
            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest('./build/tests'));

    });

    //TODO BUNDLE

    /**
     * Minifies build and bundle
     */
    gulp.task('uglify', ['typescript'], function() {

        return gulp
            .src(['./build/ringcentral.js', './build/ringcentral-bundle.js'])
            .pipe(sourcemaps.init({loadMaps: true, debug: sourcemapsDebug}))

            .pipe(uglify())

            .pipe(rename({suffix: '.min'}))

            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest('./build'));

    });

    /**
     * Propagates version number to package.json and bower.json
     */
    gulp.task('version', ['typescript'], function(cb) {

        var pkg = require('./package.json'),
            bower = require('./bower.json'),
            version = require('./build/ringcentral').SDK.version;

        pkg.version = version;
        bower.version = version;

        fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
        fs.writeFileSync('./bower.json', JSON.stringify(bower, null, 2));

        gutil.log('Current version is', gutil.colors.magenta(version));

        cb();

    });

    /**
     * Quick Task
     */
    gulp.task('quick', ['typescript', 'tests', 'version']);

    /**
     * Default Task
     */
    gulp.task('default', ['quick', 'uglify']);

    /**
     * Watch Task
     *
     * (!) This will not run version and uglify, the one must run full build before commit
     */
    gulp.task('watch', ['quick'], function() {

        gulp.watch(['./src/**/*.ts', './utils/**/*.js'], ['quick']);

    });

})();