// ESTE ARCHIVO UTILIZARA EL MODULO PASSPORT EL CUAL SIRVE PARA QUE, 
// LUEGO QUE EL USUARIO SE AUTENTIQUE, TENER UNA MANERA, NO SOLO DE PODER CONFIRMAR SI PUEDE 
// INGRESAR O NO, SINO TAMBIEN GUARDAR SUS DATOS EN UNA SESSION

const passport = require("passport");

//Metodo de autenticacion local con Strategy
const LocalStrategy = require("passport-local").Strategy; 

//se debe consultar en la base de datos
const User = require("../models/User")

//Nueva Estrategia de Autenticacion
passport.use(new LocalStrategy({
    //A traves de que se va autenticar el usuario
    usernameField: 'email'
    //Se crea una funcion para poder validarlo recibiendo los datos
}, async (email, password, done)=>{
    //buscar en la base de datos 
    //verificar si existe en la BD
    // si el password es valido
    //No olvidar que si una tarea toma tiempo se utiliza el metodo async y en la tarea await
    const user = await User.findOne({email: email})
    if (!user){
        return done(null, false, {message: 'Not User Found'});
    }else{
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message: 'Incorrect Password'})
        }
    }
}));

//Una vez autenticado el usuario se debe almacenra en algun lugar

//tomar un usuario y un callback
passport.serializeUser((user, done)=>{
    //ejecutar el callback con un error null pero con un usuario ID
    //Se almacena en una session el ID del usuario para evitar login cnstante
    done(null, user.id);
})

//es el proceso inverso
passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=>{
        done(err, user);
    })
})