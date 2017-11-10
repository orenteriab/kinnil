/*
* Es un test, aun no funciona.
*/


// load up the user model
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);


module.exports = function(models) {
    models.use(
        'inicio',
        function(req, done) {
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            connection.query("select e.activo 'estado', m.nombre 'maquina', p.nombre 'producto' from eventos e, maquinas m, productos p where e.maquinas_id = m.id and p.maquinas_id = m.id",function(e,r){
                if (e)
                    return done(err);
                if (r.length) {
                    return done(null, false, req.flash('eventos', r));
                }
            });
        })
}
/*
function inicio() {
    connection.query("select e.activo 'estado', m.nombre 'maquina', p.nombre 'producto' from eventos e, maquinas m, productos p where e.maquinas_id = m.id and p.maquinas_id = m.id",function(e,r){
        return r;
	});
}
*/
        