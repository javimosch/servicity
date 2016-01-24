var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var exorcist = require('exorcist');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var rename = require("gulp-rename");
var clean = require('gulp-clean');
var jade = require('gulp-jade');
var data = require('gulp-data');
var _ = require('lodash');


var jadeLocals = {
    self: {
        root: '/'
    }
};

var isProduction = false;

//expand watch limit (linux)
//echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

// Input file.
watchify.args.debug = true;
var scriptsBundler = watchify(browserify('./src/scripts/app.js', watchify.args));
var vendorBundler = watchify(browserify('./src/vendor/vendor.js', watchify.args));

// Babel transform
scriptsBundler.transform(babelify.configure({
    sourceMapRelative: './src/scripts'
}));



var tasks = {
    watchAssets: function() {
        watch(['src/assets/**/*.*', '!src/assets/**/*.png', '!src/assets/**/*.jade'], function() {
            gulp.run('build:assets');
        });
        watch(['src/assets/**/*.jade', 'src/assets/**/*.html','src/assets/**/*.json'], function() {
            gulp.run('build:jade');
        });
    },
    moveAssets: function() {
        return gulp.src(['src/assets/**', '!src/assets/**/*.jade', '!src/**/_*.*'])
            .pipe(gulp.dest('dist'))
            .pipe(gulpif(!isProduction, browserSync.stream({
                once: true
            })));
    },
    compileJade: function() {
        gulp.src('src/assets/**/index.jade')
            .pipe(data(function(file, cb) {
                var path = file.path.replace('index.jade', '') + '_data.json';
                if(require.cache[path]){
                    delete require.cache[path];
                }
                cb(undefined,_.extend(require(path), jadeLocals));
            }))
            .pipe(jade())
            .on('error', function(err) {
                gutil.log(err.message);
                browserSync.notify("Jade Error!");
                this.end();
            })
            .pipe(gulp.dest('dist'))
            .pipe(gulpif(!isProduction, browserSync.stream({
                once: true
            })));
    },
    watchStyles: function() {
        watch(['src/styles/**/*.*'], function() {
            gulp.run('build:styles');
        });
    },
    compileStyles: function() {
        return gulp.src('src/styles/app.scss')
            .pipe(sass({
                includePaths: [
                    './node_modules/bootstrap-sass/assets/stylesheets'
                ]
            }))
            .pipe(gulp.dest('dist'))
            .pipe(gulpif(!isProduction, browserSync.stream({
                once: true
            })));
    },
    compileVendorScripts: function() {
        gutil.log('Compiling JS... (Vendor)');
        return vendorBundler.bundle()
            .on('error', function(err) {
                gutil.log(err.message);
                browserSync.notify("Browserify Error!");
                this.emit("end");
            })
            .pipe(exorcist('dist/vendor.js.map'))
            .pipe(source('vendor.js'))
            .pipe(gulp.dest('./dist'))
            .pipe(gulpif(!isProduction, browserSync.stream({
                once: true
            })));
    },
    compileScripts: function() {
        gutil.log('Compiling JS...');
        return scriptsBundler.bundle()
            .on('error', function(err) {
                gutil.log(err.message);
                browserSync.notify("Browserify Error!");
                this.emit("end");
            })
            //.pipe(gulpif(isProduction, uglify()))
            .pipe(gulpif(isProduction, minify()))
            .pipe(exorcist('dist/app.js.map'))
            .pipe(source('app.js'))
            .pipe(gulp.dest('./dist'))
            .pipe(gulpif(!isProduction, browserSync.stream({
                once: true
            })));
    },
    buildDev: function(cb) {
        runSequence('clean', 'build:vendor', 'build:scripts', 'build:assets', 'build:jade', 'build:styles', function() {
            cb();
        });
    },
    buildProdScripts: function() {
        return gulp.src('src/scripts/app.js')
            .pipe(browserify({
                insertGlobals: true,
                debug: !isProduction
            }))
            .pipe(gulpif(!isProduction, sourcemaps.init()))
            .pipe(gulpif(isProduction, uglify()))
            .pipe(gulpif(isProduction, minify()))
            .pipe(gulpif(!isProduction, sourcemaps.write()))
            .pipe(rename('app.js'))
            .pipe(gulp.dest('dist'));
    },
    buildProdVendor: function() {
        return gulp.src('src/vendor/vendor.js')
            .pipe(browserify({
                insertGlobals: true,
                debug: !isProduction
            }))
            .pipe(gulpif(!isProduction, sourcemaps.init()))
            //.pipe(gulpif(isProduction, uglify()))
            //.pipe(gulpif(isProduction, minify()))
            .pipe(gulpif(!isProduction, sourcemaps.write()))
            .pipe(rename('vendor.js'))
            .pipe(gulp.dest('dist'));
    },
    buildProd: function() {
        isProduction = true;
        return runSequence('clean', 'build-prod:vendor', 'build-prod:scripts', 'build:assets', 'build:jade', 'build:styles', function() {});
    },
    clean: function() {
        return gulp.src('dist', {
                read: false
            })
            .pipe(clean({
                force: true
            }));
    },
    watch: function() {
        return runSequence('build-dev', 'watch:assets', 'watch:styles', 'server');
    },
    server: function() {
        browserSync.init({
            server: "./dist",
            port: 3334,
            open: false
        });
    }
};

// On updates recompile
scriptsBundler.on('update', tasks.compileScripts);
vendorBundler.on('update', tasks.compileVendorScripts);

gulp.task('build:scripts', tasks.compileScripts);
gulp.task('watch:styles', tasks.watchStyles);
gulp.task('build:styles', tasks.compileStyles);
gulp.task('watch:assets', tasks.watchAssets);
gulp.task('build:jade', tasks.compileJade);
gulp.task('build:assets', tasks.moveAssets);
gulp.task('build:scripts', tasks.compileScripts);
gulp.task('build:vendor', tasks.compileVendorScripts);
gulp.task('build', tasks.buildProd);
gulp.task('build-dev', tasks.buildDev);
gulp.task('build-prod', tasks.buildProd);
gulp.task('build-prod:scripts', tasks.buildProdScripts);
gulp.task('build-prod:vendor', tasks.buildProdVendor);
gulp.task('clean', tasks.clean);
gulp.task('watch', tasks.watch);
gulp.task('server', tasks.server);
gulp.task('default', tasks.watch);