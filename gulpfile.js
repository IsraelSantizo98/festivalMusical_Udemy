//CSS
const { src, dest, watch, parallel } = require('gulp'); //Retorna multiples funciones de lo contrario se coloca nombre
const sass = require("gulp-sass")(require('sass')); //Ir a la carpeta de node-module gulp-sass para poder compilarlo
const plumber = require('gulp-plumber');
const autoprefixer = require ('autoprefixer');//Se asegura que funcione con el navegador que escojamos
const cssnano = require ('cssnano'); //Comprime el codigo
const postcss = require ('gulp-postcss'); //Hace transformaciones por medio de autoprofixer y cssnano
const sourcemaps = require ('gulp-sourcemaps');
//Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif= require('gulp-avif');
//Javascript
const terser = require ('gulp-terser-js');
/* Crear tareas como funcion, callback, fn o done para terminar tarea*/
function css (done){   
    src('src/scss/**/*.scss')//Identificar el archivo a compilar o colocar **/* para que este pendiente de cambios en cualquier archivo .scss
        .pipe(sourcemaps.init())
        .pipe (plumber()) //evitar tener el work flow
        .pipe( sass())//Leer el archivo y compilarlo
        .pipe( postcss([ autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css'))//Almacenar el archivo
    done();
}
function imagenes(done){
    const opciones = {
        optimizationLevel: 3
    }
    src('src/img/**/*.{png,jpg}')
        .pipe(cache(imagemin(opciones)))
        .pipe (dest('build/img'))
    done();
}
function versionWebp(done){
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done();
}
function versionAvif(done){
    const opciones = {
        quality: 50
    };
    src('src/img/**/*.{png,jpg}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}
function javascript(done){
    src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));
    done();
}
function dev(done){
    watch('src/scss/**/*.scss', css);//Que archivo se le permite el watch y luego la funcion css que es la tarea
    watch('src/scss/**/*.js', javascript);//Que archivo se le permite el watch y luego la funcion css que es la tarea
    done();
}
/* Habilitar tarea para la terminal */
exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.avif = avif;
exports.versionWebp = versionWebp;
exports.dev = parallel(versionWebp, imagenes, dev, versionAvif, javascript);
exports.devs = dev;