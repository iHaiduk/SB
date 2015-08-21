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
    mainBowerFiles = require('main-bower-files');

var path = {
    devDir: ".development/",
    liveDir: ".public/",
    dirCss: "style/",
    dirJs: "js/",
    vendor: "vendor/",
    dist: "dist/",

    source: "./Source/",
    // Library
    bowerPathLibrary: "BowerLibrary/",
    node_modulesPath: "./node_modules/",
    // HTML, Template

    pathTemplate: "Template/**/",

    // CSS
    pathStyle: "Styles/**/",

    // JS Front

    pathFrontCode: "FrontEnd/**/"

    // JS Back


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
        .pipe(gulp.dest(path.devDir+path.dirCss+path.vendor));
});
gulp.task('vendorJs', function() {
    return gulp.src(mainBowerFiles("**/*.js"))
        .pipe(gulp.dest(path.devDir+path.dirJs+path.vendor));
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
        .pipe(gulp.dest(path.devDir + path.dirCss));
});

// Front
gulp.task('cjsx', function() {
    gulp.src(path.source + path.pathFrontCode+'*.cjsx')
        .pipe(cjsx({bare: true}))
        .pipe(react())
        .pipe(gulp.dest(path.devDir+path.dirJs+path.dist));
});


// Start
gulp.task('default', gulpsync.sync(['clean', /*"pull",*/ 'bower', 'vendorCss', 'vendorJs', 'cjsx', "templates"]));