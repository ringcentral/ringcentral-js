(function() {

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        sourcemaps = require('gulp-sourcemaps'),
        buildDir = ('buildDir' in gutil.env) ? gutil.env.buildDir : '.',
        build = buildDir + '/build',
        sourcemapsDebug = false;

    gutil.log('Working directory:', gutil.colors.magenta(process.cwd()));
    gutil.log('Build directory:', gutil.colors.magenta(buildDir));

    gulp.task('version', function() {

        var replace = require('gulp-replace');

        return gulp.src(['./bower.json', './package.json'])
            .pipe(replace(/"version": "[^"]+?"/ig, '"version": "' + require('./lib/index').version + '"'))
            .pipe(gulp.dest('.'));

    });

    gulp.task('clean', function() {

        var fs = require('fs'),
            files = ['.js', '.js.map', '.min.js', '.min.js.map'];

        files.forEach(function(file) {
            var path = process.cwd() + '/' + buildDir + '/build/rc-sdk' + file;
            fs.existsSync(path) && fs.unlinkSync(path);
        });

    });

    gulp.task('rjs', ['clean', 'version'], function() {

        var addSrc = require('gulp-add-src'),
            amdClean = require('gulp-amdclean'),
            amdOptimize = require('amd-optimize'),
            concat = require('gulp-concat'),
            wrapJs = require('gulp-wrap-js'),
            ignore = ['crypto-js', 'dom-storage', 'es6-promise', 'pubnub', 'xhr2'];

        return gulp.src(['./lib/*/**/*.js', './lib/RCSDK.js'])

            .pipe(amdOptimize('RCSDK', {
                baseUrl: './lib',
                exclude: ignore,
                paths: ignore.reduce(function(paths, file) { //TODO Replace with simple "exclude"
                    paths[file] = 'empty:';
                    return paths;
                }, {}),
                preserveComments: true
            }))

            .pipe(addSrc.append('./lib/umd.js'))

            .pipe(sourcemaps.init({debug: sourcemapsDebug}))

            .pipe(concat('rc-sdk.js'))

            .pipe(amdClean.gulp({
                transformAMDChecks: false,
                wrap: false,
                ignoreModules: ignore.map(function(name) { return name.replace('-', '_'); })
            }))

            .pipe(wrapJs('(function(root){%= body %})(this);', {
                indent: {
                    style: '  ',
                    adjustMultilineComment: true
                }
            }))

            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest(buildDir + '/build'));

    });

    gulp.task('default', ['rjs'], function() {

        var uglify = require('gulp-uglify'),
            rename = require('gulp-rename');

        return gulp.src([buildDir + '/build/rc-sdk.js'])
            .pipe(sourcemaps.init({loadMaps: true, debug: sourcemapsDebug}))

            .pipe(rename({suffix: '.min'}))

            .pipe(uglify())

            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest(buildDir + '/build'));

    });

    gulp.task('watch', ['default'], function() {
        gulp.watch('lib/**/*.js', ['default']).on('change', function(event) {
            gutil.log(gutil.template('File <%= file %> was <%= type %>, running tasks', {file: gutil.colors.magenta(event.path), type: event.type}));
        });
    });

})();