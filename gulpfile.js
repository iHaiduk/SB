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
    browserSync = require('browser-sync').create();

var path = {
    devDir: ".development/",
    liveDir: ".public/",
    dirCss: "style/",
    dirJs: "js/",
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
    return gulp.src(['.development'], {read: false})
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
        .pipe(gulp.dest(path.devDir + path.dirJs + path.vendor));
});

// Git
gulp.task('pull', function(){
    git.pull('origin', 'master', function (err) {
        if (err) throw err;
    });
});

// HTML
gulp.task('templates', function() {
    var YOUR_LOCALS = {};

    gulp.src(path.source + path.pathTemplate + "*.jade")
        .pipe(jade({
            locals: YOUR_LOCALS,
            pretty: true
        }))
        .pipe(gulp.dest(path.devDir))
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

// Watch
gulp.task('watch', function() {
    gulp.watch(path.source + path.pathTemplate + "*.jade", ['templates']);
    gulp.watch(path.source + path.pathStyle + '*.scss', ['sass']);
    gulp.watch(path.source + path.pathImages + "*", ['images']);
    gulp.watch(path.source + path.pathFrontCode+'*.cjsx', ['frontend']);
    gulp.watch(path.source + path.pathBackCode+'*.coffee', ['backend']);
});

gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: path.devDir
        }
    });
});

// Start
gulp.task('default', gulpsync.sync(['clean', /*'pull'*/, 'bower', 'vendorCss', 'vendorJs', 'templates', 'sass', 'frontend', 'backend', 'browser-sync', 'watch']));