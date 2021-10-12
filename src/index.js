const express = require("express");
const path = require("path");//proporciona utilidades para trabajar con rutas de directorio y archivos
const exphbs = require("express-handlebars"); //este es un motor de plantillas que se puede usar en ambos lados 
const methodOverride = require("method-override"); //permite usar verbos HTTP como PUT o DELETE en lugares donde el cliente no lo admite.
const session = require("express-session"); //almacena los datos de sesión en el servidor
const flash = require("connect-flash"); //Permite enviar mensajes entre multiples vistas, de esta forma cuando agregamos un dato se le puede enviar un mensaje al usuario y demas.
const passport = require("passport"); // Para la autenticacion

//INITIALIZATIONS -----------------------------------------------------------------------------------------------
const app = express();
require('./database');
require('./config/passport');//Se debe utilizar la autenticacion

//SETTINGS ---------------------------------------------------------------------------------------------------

// process.env.PORT == significa que si existe un puerto en la pc que lo tome o que tome el puerto 3000
app.set('port', process.env.PORT || 3000);

//Sentencia para indicar donde esta la carpeta views
//path.join()-> permite unir directorios 
//_dirname es una constante que devuelve la ruta de en donde se esta ejecutando determinado archivo
//en este caso devuuelve la carpeta src y puedo concatenar con la carpeta views
app.set('views', path.join(__dirname, 'views'));

/**
 * Configuracion de Handlebars
 * Dentro de la configuracion se pasan dos parametros, el primero es el nombre y el segundo es una funcion
 * al que se le pasa como parametro un objeto con sus propiedades. Esta propiedades sirven para conocer de que manera
 * se utilizaran las vistas
 */
app.engine('.hbs', exphbs({
    defaultLayout: 'main',//defino la vista principal
    layoutsDir:path.join(app.get('views'),'layouts'),//obtener la direccion del views y concatenar con el layout
    partialsDir:path.join(app.get('views'),'partials'),//pequenas partes de html que se pueden reutilizar en cualquier parte
    extname:'.hbs', //que extension tendra los archivos
    //Tenia un error: Access has been denied to resolve the property "name" because it is not an "own property" of its parent.
    //Lo siguiente lo resolvio
    runtimeOptions: {
        allowProtoPropertiesByDefault: true, //un valor booleano (predeterminado: falso) que define si las propiedades que no son métodos que se definen en el prototipo de un objeto deben poder resolverse o no, de forma predeterminada.
        allowProtoMethodsByDefault: true //un valor booleano (predeterminado: falso) que define si los métodos que se definen en el prototipo de un objeto deben poder resolverse o no, de forma predeterminada.
    }
}))
/**
 * Para utilizar la configuracion de Handlebars se utiliza este comando
 * 
 */
app.set('view engine', '.hbs');

//MIDDLEWARES ---------------------------------------------------------------------------------------------------
/**
 * express.urlencoded sirve para que luego que un formulario envie determinado dato pueda entenderlo
 * se pasa el objeto extended:false porque solo se espera texto
 */
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));

/**
 * Session me permitira una mejor manera de autenticacion
 */
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized: true
}));


/**
 * Passport debe estar de babajo de session
 */
app.use(passport.initialize());
app.use(passport.session());

/**
 * Flash debe estar debajo de passport
 */
app.use(flash());
//GLOBALS VARIABLES ----------------------------------------------------------------------------------------------
app.use((req, res, next) => {
    //creo una variable que almacena el mensaje de exito
    res.locals.success_msg = req.flash('success_msg');

    //creo una variable que almacena el mensaje de error
    res.locals.error_msg = req.flash('error_msg');

    //creo variable de error para la autenticacion
    res.locals.error = req.flash('error');

    //creo una variable para contener los datos del usuario
    res.locals.user = req.user || null;
    //Muy importante colocar next
    next();
})

//ROUTES ----------------------------------------------------------------------------------------------------------
/**
 * Aca voy a configurar las url que van dentro de la carpeta routes
 */
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//STATICS FILES ---------------------------------------------------------------------------------------------------
app.use(express.static(path.join(__dirname,'public')));

//SERVER IS LISTENNIGS ----------------------------------------------------------------------------------------------
app.listen(app.get('port'), ()=>{
    console.log("Server on port", app.get('port'));
    console.log("Excelent");
});