const path = require('path');
const gulp = require('gulp');
const ts = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const rollup = require('gulp-better-rollup');
const minify = require('gulp-minify');

const rollupConfig = require('./rollup');

const createTSC = (tsconfig) => () => gulp.src(tsconfig.include[0])
    .pipe(ts(tsconfig.compilerOptions))
    .pipe(gulp.dest(tsconfig.compilerOptions.outDir));

const createRollup = (input, pkg) => () => {

    const config = rollupConfig(input, pkg);

    return gulp.src(config.input)
        .pipe(sourcemaps.init())
        .pipe(rollup({
            plugins: config.plugins,
            external: config.external
        }, config.output))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dirname(config.output.file)));

};

const createMinify = (pkg) => () => {

    return gulp.src(pkg.browser)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(minify({
            ext: {
                source: 'ringcentral.js',
                min: '.min.js'
            }
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.dirname(pkg.browser)));

};

module.exports.createTSC = createTSC;
module.exports.createRollup = createRollup;
module.exports.createMinify = createMinify;