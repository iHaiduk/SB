var gulp = require('gulp'),
    gulpsync = require('gulp-sync')(gulp),
    git = require('gulp-git'),
    clean = require('gulp-clean'),
    bower = require('gulp-bower'),
    notify = require("gulp-notify"),
    cjsx = require('gulp-cjsx'),
    jade = require('gulp-jade'),
    react = require('gulp-react'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    mainBowerFiles = require('main-bower-files'),
    gitWatch = require('gulp-git-watch'),
    browserSync = require('browser-sync').create(),
    nodemon = require('gulp-nodemon'),
    runSequence = require('run-sequence');

var config = {

    autoUpdate: false,
    // we'd need a slight delay to reload browsers
    // connected to browser-sync after restarting nodemon
    BROWSER_SYNC_RELOAD_DELAY: 500

};

var path = {
    devDir: ".development/",
    liveDir: ".public/",
    dirCss: "style/",
    dirJs: "js/",
    dirTemplate: "template/",
    dirImages: "images/",
    vendor: "vendor/",
    dist: "dist/",

    system: "system/",
    view: "view/",

    source: "./Source/",

    // Library
    bowerPathLibrary: "BowerLibrary/",
    node_modulesPath: "./node_modules/",

    // HTML, Template
    pathTemplate: "Templates/**/",

    // CSS
    pathStyle: "Styles/**/",

    // Images
    pathImages: "Images/**/",

    // JS Front
    pathFrontCode: "FrontEnd/**/",

    // JS Back
    pathBackCode: "BackEnd/**/"

};

// Clean
gulp.task('clean', function() {
    gulp.src(['.development'], {read: false})
        .pipe(clean());
});
gulp.task('bowerPathLibraryClean', function() {
    return gulp.src(path.source + path.bowerPathLibrary, {read: false})
        .pipe(clean());
});
gulp.task('node_modulesClean', function() {
    return gulp.src(path.node_modulesPath, {read: false})
        .pipe(clean());
});

// Library
gulp.task('bower', function() {
    return bower()
        .pipe(gulp.dest(path.source + path.bowerPathLibrary));
});
gulp.task('vendorCss', function() {
    return gulp.src(mainBowerFiles("**/*.css"))
        .pipe(gulp.dest(path.devDir + path.view + path.dirCss + path.vendor));
});
gulp.task('vendorJs', function() {
    return gulp.src(mainBowerFiles("**/*.js"))
        .pipe(gulp.dest(path.devDir + path.view + path.dirJs + path.vendor));
});

// Git
gulp.task('gitUpdate', function(){
    git.pull('origin', 'master', function (err) {
        if (err) throw err;
    });
});

// HTML
gulp.task('templates', function() {
    gulp.src(path.source + path.pathTemplate + "**/*.jade")
        .pipe(gulp.dest(path.devDir + path.dirTemplate));
});

// CSS
gulp.task('sass', function () {
    gulp.src(path.source + path.pathStyle + '*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ["> 0%"],
            cascade: false
        }))
        .pipe(gulp.dest(path.devDir + path.view + path.dirCss));
});

// Images Optimization
gulp.task('images', function () {
    return gulp.src(path.source + path.pathImages + "*")
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest(path.devDir + path.view + path.dirImages));
});

// Front
gulp.task('frontend', function() {
    gulp.src(path.source + path.pathFrontCode+'*.cjsx')
        .pipe(cjsx({bare: true}))
        .pipe(react())
        .pipe(gulp.dest(path.devDir + path.view + path.dirJs + path.dist));
});

// Back
gulp.task('backend', function() {
    gulp.src(path.source + path.pathBackCode+'*.coffee')
        .pipe(cjsx({bare: true}))
        .pipe(react())
        .pipe(gulp.dest(path.devDir + path.system));
});

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({

        // nodemon our expressjs server
        script: path.devDir + path.system + 'app.js',

        // watch core server file(s) that require server restart on change
        watch: [path.devDir + path.system + 'app.js', path.devDir + path.system + "**/*.js", path.devDir + path.dirTemplate + "**/*.*"]
    })
        .on('start', function onStart() {
            // ensure start only got called once
            if (!called) { cb(); }
            called = true;
        })
        .on('restart', function onRestart() {
            // reload connected browsers after a slight delay
            setTimeout(function reload() {
                browserSync.reload({stream:true});
            }, config.BROWSER_SYNC_RELOAD_DELAY);
        });
});

// Browser-sync
gulp.task('browser-sync', ['nodemon'], function() {
    // for more browser-sync config options: http://www.browsersync.io/docs/options/
    browserSync.init({

        // watch the following files; changes will be injected (css & images) or cause browser to refresh
        files: [path.devDir + path.system + '*.js', path.devDir + "**/*"],

        // informs browser-sync to proxy our expressjs app which would run at the following location
        proxy: 'localhost:3000',

        // informs browser-sync to use the following port for the proxied app
        // notice that the default port is 3000, which would clash with our expressjs
        port: 4000,

        // open the proxied app in chrome
        browser: ["google chrome"]
    });
});

// Git watcher
gulp.task('git-watch', function() {
    gitWatch()
        .on('change', function(newHash, oldHash) {
            var currentdate = new Date();
            var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/"
                + currentdate.getFullYear() + " @ "
                + currentdate.getHours() + ":"
                + currentdate.getMinutes() + ":"
                + currentdate.getSeconds();
            notify("Git CHANGES!");
            if(config.autoUpdate){
                runSequence("gitUpdate");
            }
            console.log('CHANGES! FROM', oldHash, '->', newHash, datetime);
        });
});

// Watch
gulp.task('watch', function() {
    gulp.watch(path.source + path.pathTemplate + "*.jade", ['templates']);
    gulp.watch(path.source + path.pathStyle + '*.scss', ['sass']);
    gulp.watch(path.source + path.pathImages + "*", ['images']);
    gulp.watch(path.source + path.pathFrontCode+'*.cjsx', ['frontend']);
    gulp.watch(path.source + path.pathBackCode+'*.coffee', ['backend']);
});

// Start All
gulp.task('default', gulpsync.sync(['clean', 'gitUpdate', 'bower', 'vendorCss', 'vendorJs', 'templates', 'sass', 'frontend', 'backend', 'browser-sync', 'git-watch', 'watch']));