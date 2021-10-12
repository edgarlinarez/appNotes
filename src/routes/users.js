//ACCEDER URL DE AUTENTICACION

//Se requiere express no para crear el servidor sino para las rutas

const express = require('express');
const router = express.Router();
const User = require("../models/User");
const passport = require("passport") //para la autenticacion

/**
 * El metodo Router permite tener un objeto que puede facilitar la creacion de rutas
 */
//Ruta para hacer login
router.get('/users/signin',(req,res)=>{
    res.render("users/signin")
});

//uso del metodo post para la autenticacion y el nombre de la estrategia de autenticacion que es local
router.post('/users/signin', passport.authenticate('local', {
    //Dependiendo de lo que ocurra passport se le indica lo siguiente
    successRedirect: '/notes', //Si salio bien se redirecciona al lugar correcto
    failureRedirect: '/users/signin', //si salio mal se mantiene en el mismo lugar
    failureFlash: true //poder mandar mensajes flash
}))

//ruta para registrar
router.get('/users/signup',(req,res)=>{
    res.render("users/signup")
});

//ruta para recibir los datos registrados
router.post('/users/signup', async (req, res)=>{
    const {name, email, password, confirm_password} = req.body;
    const errors = [];

    if (name.length == 0 || email.length == 0 || password.length == 0 || confirm_password.length == 0){
        errors.push({text: 'Alguno de los campos esta vacio...'})
    }else{
        if (password != confirm_password){
            errors.push({text: 'El password de confirmacion es distinto...'})
        }
        if (password.length < 5){
            errors.push({text: 'Ingrese un password mayor de 4 digitos...'});
        }
    }
    
    if (errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password})
    }else{
        //Si el email esta repetido se hace una busqueda en la base de datos 
        const emailUser = await User.findOne({email : email});
        if(emailUser){
            req.flash('error_msg', 'El email esta en uso');
            res.redirect('/users/signup');
        }else{
            //Se crea un nuevo usuario y 
            const newUser = new User({name,email,password}) 
            //GUARDAR PASSWORD CIFRADA
            newUser.password =  await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Estas registrado!');
            res.redirect('/users/signin');
        }
    }    
})

router.get('/users/logout', (req, res)=> {
    req.logOut();
    res.redirect('/');
})

module.exports = router;