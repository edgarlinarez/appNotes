var mongoose = require("mongoose");

/**
 * Se utiliza el metodo conect
 * Si la Base de Datos no existe la creara
 * hay que colocarle un objeto de configuracion porque el modulo se actualiza constantemente
 * 
 */
mongoose.connect('mongodb://localhost/notes-db-app')
    .then(db => console.log("DB is connected..."))
    .catch(err => console.error(err));