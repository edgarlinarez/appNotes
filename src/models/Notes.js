//SE REQUIERE PARA CREAR ESQUEMAS DE DATOS
const mongoose = require("mongoose");

const {Schema} = mongoose;

//Definir que propiedades van a tener las notas
//Esta constante variable determina como van a lucir los datos
const NoteSchema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: true},
    date: { type: Date, default: Date.now},
    user: { type: String} //utilizado para almacenar el id user
});


module.exports = mongoose.model('Note', NoteSchema)