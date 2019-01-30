const gulp = require( 'gulp' );
const sass = require( 'gulp-sass' );
const del = require( 'del' );
const browserify = require( 'browserify' );
const babelify = require( 'babelify' );
const source = require( 'vinyl-source-stream' );
const browserSync = require( 'browser-sync' );

const SRC_ROOT = 'src';
const DEST_ROOT = 'dist';

const clean = () => {
    return del( DEST_ROOT );
}

const copyHtmls = () => {
    return gulp.src( `${SRC_ROOT}/*.html` )
        .pipe( gulp.dest( DEST_ROOT ) );
}

const copyAssets = () => {
    return gulp.src( `${SRC_ROOT}/assets/**` )
        .pipe( gulp.dest( `${DEST_ROOT}/assets` ) );
}

const copyVendor = () => {
    return gulp.src( `${SRC_ROOT}/vendor/**` )
        .pipe( gulp.dest( `${DEST_ROOT}/vendor` ) )
}

const styles = () => {
    return gulp.src( `${SRC_ROOT}/sass/*.scss` )
        .pipe( sass() )
        .pipe( gulp.dest( `${DEST_ROOT}/css` ) );
}

const scripts = () => {
    return browserify( `${SRC_ROOT}/js/App.js`, { debug: true } )
        .transform( babelify, { presets: [ '@babel/preset-env' ] } )
        .bundle()
        .on( 'error', err => console.log( `Error : ${err.message}` ) )
        .pipe( source( 'bundle.js' ) )
        .pipe( gulp.dest( `${DEST_ROOT}/js` ) );
}

const server = browserSync.create();
const reload = ( done ) => {
    server.reload();
    done();
}

const serve = ( done ) => {
    server.init({
        server: {
            baseDir: DEST_ROOT
        }
    });
    done();
};

const watchFiles = ( done ) => {
    gulp.watch( `${SRC_ROOT}/*.html`, gulp.series( copyHtmls, reload ) );
    gulp.watch( `${SRC_ROOT}/js/**`, gulp.series( scripts, reload ) );
    gulp.watch( `${SRC_ROOT}/sass/*.scss`, gulp.series( styles, reload ) );
    done();
}

const build = gulp.series( clean, gulp.parallel( copyHtmls, copyAssets, copyVendor, styles, scripts ), serve, watchFiles );

gulp.task( 'default', build );