// ACA ESTARAN LAS URL DE LA APLICACION PRINCIPAL

//Se requiere express no para crear el servidor sino para las rutas

const express = require('express');
const router = express.Router();
/**
 * El metodo Router permite tener un objeto que puede facilitar la creacion de rutas
 */

router.get('/',(req,res)=>{
    //Como respuesta renderiza o envia el archivo hbs
    res.render("index");
})

router.get('/about',(req,res)=>{
    //Como respuesta renderiza o envia el archivo hbs
    res.render("about");
})

module.exports = router;