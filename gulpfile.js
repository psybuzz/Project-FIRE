var gulp = require('gulp');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');

// Define paths.
var path = {
	html: 'app/*.html',
	scripts: [
		'app/scripts/**/!(App)*.js',
		'!app/scripts/vendor/*.js',
		'app/scripts/App.js'],
	vendorScripts: [
		'app/scripts/vendor/jquery*.js',
		'app/scripts/vendor/underscore*.js',
		'app/scripts/vendor/*.js'],
	images: 'app/images/*',
	sounds: 'app/sounds/*',
	styles: 'app/styles/*.css'
};


// Lint scripts.
gulp.task('lint', function (){
	return gulp.src(path.scripts)
			.pipe(jshint())
			.pipe(jshint.reporter('default'));
});

// Combine and minify scripts.
gulp.task('scripts', function (){
	return gulp.src(path.scripts)
			.pipe(concat('scripts-all.js'))
			.pipe(gulp.dest('app/build/scripts'))
			.pipe(rename('scripts-all.min.js'))
			.pipe(uglify())
			.pipe(gulp.dest('app/build/scripts'));
});

// Combine vendor scripts.
gulp.task('vendorScripts', function (){
	return gulp.src(path.vendorScripts)
			.pipe(concat('vendor-all.min.js'))
			.pipe(gulp.dest('app/build/scripts'));
});

// // TODO: Use gulp-sass.
// gulp.task('sass', function (){
// 	return gulp.src(path.scss)
// 			.pipe(sass())
// 			.pipe(gulp.dest('app/build/css'));
// });

// Watch source files for changes.
gulp.task('watch', function (){
	gulp.watch(path.scripts, ['lint', 'scripts']);
	gulp.watch(path.vendorScripts, ['vendorScripts']);
});

// Default task.
gulp.task('default', ['vendorScripts', 'scripts', 'watch']);
