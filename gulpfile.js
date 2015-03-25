(function() {

    var gulp = require('gulp'),
        gutil = require('gulp-util'),
        sourcemaps = require('gulp-sourcemaps'),
        replace = require('gulp-replace'),

        build = (('buildDir' in gutil.env) ? gutil.env.buildDir : '.') + '/build',
        sourcemapsDebug = false;

    gutil.log('Working directory:', gutil.colors.magenta(process.cwd()));
    gutil.log('Build directory:', gutil.colors.magenta(build));

    gulp.task('version', function() {

        return gulp.src(['./bower.json', './package.json'])
            .pipe(replace(/"version": "[^"]+?"/ig, '"version": "' + require('./lib/index').version + '"'))
            .pipe(gulp.dest('.'));

    });

    gulp.task('sourcemap', ['rjs'], function() {

        return gulp.src([build + '/rc-sdk.js.map'])
            .pipe(replace(/webpack:\/\/\//g, ''))
            .pipe(replace(/(.\/lib\/)/g, '.$1'))
            .pipe(gulp.dest(build));

    });

    gulp.task('clean', function() {

        var fs = require('fs'),
            extensions = ['.js', '.js.map', '.min.js', '.min.js.map'];

        extensions.forEach(function(ext) {
            var path = process.cwd() + '/' + build + '/rc-sdk' + ext;
            fs.existsSync(path) && fs.unlinkSync(path);
        });

    });

    gulp.task('jshint', function() {

        var jshint = require('gulp-jshint');
        return gulp.src(['./lib/**/*.js'])
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'))

    });

    gulp.task('rjs', ['clean', 'jshint'], function() {

        var webpack = require('gulp-webpack-build'),
            path = require('path');

        return gulp.src(path.join('.', webpack.config.CONFIG_FILENAME), {base: path.resolve('./lib')})

            .pipe(webpack.configure({
                useMemoryFs: true,
                progress: false
            }))

            //.pipe(webpack.overrides({}))

            .pipe(webpack.compile())

            .pipe(webpack.format({
                version: true,
                timings: true
            }))

            .pipe(webpack.failAfter({
                errors: true,
                warnings: true
            }))

            .pipe(gulp.dest(build));

    });

    gulp.task('default', ['version', 'sourcemap'], function() {

        var uglify = require('gulp-uglify'),
            rename = require('gulp-rename');

        return gulp.src([build + '/rc-sdk.js'])
            .pipe(sourcemaps.init({loadMaps: true, debug: sourcemapsDebug}))

            .pipe(uglify())

            .pipe(rename({suffix: '.min'}))

            .pipe(sourcemaps.write('.', {debug: sourcemapsDebug}))
            .pipe(gulp.dest(build));

    });

    gulp.task('watch', ['default'], function() {
        gulp.watch('lib/**/*.js', ['default']).on('change', function(event) {
            //TODO Gulp-Webpack-Build watcher @see https://github.com/mdreizin/gulp-webpack-build/blob/master/docs/API.md
            gutil.log(gutil.template('File <%= file %> was <%= type %>, running tasks', {file: gutil.colors.magenta(event.path), type: event.type}));
        });
    });

})();