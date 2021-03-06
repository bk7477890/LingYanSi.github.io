var gulp = require('gulp');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer')

gulp.task('less',function(){
    gulp.src('./build/base.less')
        .pipe(less())
        .pipe( autoprefixer() )
        .pipe( gulp.dest('./src/') )
});

gulp.task('watch', function(){
    gulp.watch('./build/**.less',['less'])
})

gulp.task('default',['watch'],function (argument) {
    gulp.start('less');
})
