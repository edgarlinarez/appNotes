const mongoose = require("mongoose");
const {Schema} = mongoose;
const bcrypt = require("bcryptjs");// es una funcion de hashing de password que evita que dos pasword iguales generen el mismo hash

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

//Metodo para recibir contrasennia para cifrarla usando el modulo bcryptsjs
UserSchema.methods.encryptPassword = async (password) => {
    //Esto es para generar un Hash
    //Salt = comprende bits aleatorios que se usan como una de las entradas en una función derivadora de claves.
    //genSalt es una funcion y se le pasa como parametro un valor numerico que define el numero de rondas o caracteres para cifrar la clave
    const salt = await bcrypt.genSalt(10)

    //Luego concateno el password y la salt, para luego hashearlo y obtengo la contraena encriptada
    const hash = bcrypt.hash(password, salt);
    return hash;
};

/**
 * Si la contrasennia esta cifrada en la BD, luego el usuario como se podra loguear ya que el password es distinto a la insertada
 * El modulo provee la funcion que permite comparar password. Lo que el usuario ingresa lo va a volver a cifrar y compoara con lo que hay en ka BD
 * No utilizamos las funciones flecha sino la funcion de EmasScript5 porque se podra accesar a las propiedades al ser ejecutado
 */

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

module.exports = mongoose.model("User", UserSchema)