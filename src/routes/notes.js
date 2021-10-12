//URL DEL NEGOCIO QUE SE ESTA CREANDO EN ESTE CASO LAS NOTAS

//Se requiere express no para crear el servidor sino para las rutas

const express = require('express');
const router = express.Router();

//Se requiere para utilizar sus metodos(Save,update,delete)
const Note = require('../models/Notes')
const { isAuthenticated } = require('../helpers/auth'); //esto sera usado en cada ruta a quien yo quiera asegurar

/**
 * El metodo Router permite tener un objeto que puede facilitar la creacion de rutas
 */

router.get('/notes/add', isAuthenticated, (req, res)=>{
    res.render('notes/new-notes');
})

//RECEPCION DE LOS DATOS
//Indicamos que el proceso es asincrono para que las tareas puedan continuar su ejecucion 
router.post('/notes/new-notes', isAuthenticated, async (req, res)=>{
    //Destructuring para obtener los valores de un objeto o arreglo
    const {title, description} = req.body;
    //Validacion
    const errors = [];
    if (!title){
        errors.push({text: 'Insertar titulo...'});
    }
    if (!description){
        errors.push({text: 'Insertar descripcion...'})
    }

    //Renderizacion de toda la vista en base a la validacion
    if (errors.length > 0){
        //A parte de renderizar la vista se debe mostrar los errores 
        res.render('notes/new-notes', {
            errors, title, description
        });
    }else{
        //Almacenar los datos
        //Se debe instanciar la clase que viene del modelo
        const newNotes = new Note({title, description})

        //Asignamos el id del usuario para ser almacenado como clave foranea de notas
        newNotes.user = req.user.id;

        //Indicamos await, como no se sabe cuanto tiempo lleva el proceso de guardar, 
        //continue ejecutando las demas tareas
        await newNotes.save();//guardar
        //Enviar mensaje de exito
        req.flash('success_msg', 'Nota creada satisfactoriamente');

        //Una vez almacenado los datos redireccionar para que muestre la listas de los 
        //datos guardados
        res.redirect('/notes');
    }
});

//Listar
router.get('/notes', isAuthenticated, async (req, res)=>{
    //Buscar 
    const notes = await Note.find({user: req.user.id}).lean().sort({date: 'desc'});
    res.render('notes/all-notes',{notes});
});

//Editar
//Cuando pidan la ruta, se deben tomar los nuevos datos, pero al editar se debe renderizar para insertar los nuesvos datos
router.get('/notes/edit/:id', isAuthenticated, async (req,res)=>{
    //obtener los datos para pasarlos a la vista
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note', {note});
})

//Metodo con la ruta despues de editar
router.put('/notes/edit-note/:id', isAuthenticated, async (req,res)=>{
    const {title, description} = req.body;
    //este es el metodo para actualizar
    await Note.findByIdAndUpdate(req.params.id, {title, description});
    req.flash('success_msg', 'Nota editada satisfactoriamente');
    res.redirect('/notes');
})

//Metodo para eliminar
router.delete('/notes/delete-note/:id', isAuthenticated, async (req, res)=>{
    await Note.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Nota eliminada satisfactoriamente');
    res.redirect('/notes');
});

module.exports = router;