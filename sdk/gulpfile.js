const gulp = require('gulp');
const createConfig = require('@ringcentral/sdk-utils/gulp');
const pkg = require('./package.json');
const tsconfig = require('./tsconfig.json');

gulp.task('rollup', createConfig.createRollup('SDK', pkg));
gulp.task('tsc', createConfig.createTSC(tsconfig));
gulp.task('minify', ['rollup'], createConfig.createMinify(pkg));

gulp.task('default', ['tsc', 'rollup', 'minify']);
