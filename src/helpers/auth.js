//ACA VOY A COLOCAR LO QUE SE NESECITA PARA LOS ACCESOS DE LA AUTENTICACION
//Esto es un middleware
const helpers =  {};

helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash('error_msg', 'Not Authorized');
    res.redirect('/users/signin');
}

//recuerda que para ver los metodos en otro lado debo exportarlos

module.exports = helpers;