// app/routes.js (models)

var moment = require('moment-timezone');
var mysql = require('mysql');
var async = require('async'); // TODO: ver si hay que elimiar async, porque ya no lo estoy utilizando.....
var promiseMysql = require('promise-mysql');
var dbconfig = require('../config/database');

var Eventos = require('../models/eventos')

var promisePool = promiseMysql.createPool(dbconfig.connection);
promisePool.query('USE ' + dbconfig.database); // 

module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (LOGIN) ========
	// =====================================
	// show the login form
	app.get('/', function(req, res) {
		//res.render('pages/login.ejs'); // load the index.ejs file
		// render the page and pass in any flash data if it exists
		res.render('pages/login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/', passport.authenticate('local-login', {
            successRedirect : '/inicio', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}),
        function(req, res) {
			// If this function gets called, authentication was successful.
   			// `req.user` contains the authenticated user.

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	
	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/inicio', // redirect to the secure profile section
		failureRedirect : '/', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	

	// =====================================
	// INICIO =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/inicio', isLoggedIn, function(req, res) {

		Eventos.getDashboard(function(err, return_data) {
			// TODO: Mostrar algun mensaje o algo si el modelo regreso un error.
			res.render("pages/index.ejs",{
				turnoActual:return_data.turnoActual,
				estado: return_data.estado,
				disponibilidad:return_data.disponibilidad,
				rendimiento: return_data.rendimiento,
				calidad: return_data.calidad,
				digital: return_data.digital,
				user: req.user
			});
		})
	});

	// =====================================
	// MONITOR =============================
	// =====================================
	// Andon de 1 pantalla
	app.get('/monitor', function(req, res) {
		// TODO: Mostrar algun mensaje o algo si el modelo regreso un error.
		Eventos.getDashboard(function(err, return_data) {
			res.render("pages/monitor.ejs",{
				turnoActual:return_data.turnoActual,
				estado: return_data.estado,
				disponibilidad:return_data.disponibilidad,
				rendimiento: return_data.rendimiento,
				calidad: return_data.calidad,
			});
		})
	});

	// =====================================
	// DISPONIBILIDAD ======================
	// =====================================
	app.get('/disponibilidad', isLoggedIn, function(req, res) {
		
		Eventos.getReportesInfo(function(err, return_data, json) {
			res.render("pages/disponibilidad.ejs",{
				turnos: return_data.turnos,
				productos: return_data.productos,
				plantas: return_data.plantas,
				areas: return_data.areas,
				maquinas: return_data.maquinas,
				json: json,
				user: req.user
			});
		})
	});

	// =====================================
	// RENDIMIENTO =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/rendimiento', isLoggedIn, function(req, res) {
		
		Eventos.getReportesInfo(function(err, return_data, json) {
			res.render("pages/rendimiento.ejs",{
				turnos: return_data.turnos,
				productos: return_data.productos,
				plantas: return_data.plantas,
				areas: return_data.areas,
				maquinas: return_data.maquinas,
				json: json,
				user: req.user
			});
		})
	});

	// =====================================
	// CALIDAD =============================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/calidad', isLoggedIn, function(req, res) {

		Eventos.getReportesInfo(function(err, return_data, json) {
			res.render("pages/calidad.ejs",{
				turnos: return_data.turnos,
				productos: return_data.productos,
				plantas: return_data.plantas,
				areas: return_data.areas,
				maquinas: return_data.maquinas,
				json: json,
				user: req.user
			});
		})
	});

	// =====================================
	// MODIFICAR CALIDAD ===================
	// =====================================
	app.get('/modificarcalidad', isLoggedIn, function(req, res) {
		
		Eventos.getModificarCalidad(function(err, return_data, json) {
			res.render("pages/modificarcalidad.ejs",{
				turnos: return_data.turnos,
				maquinas: return_data.maquinas,
				plantas: return_data.plantas,
				areas: return_data.areas,
				razones_calidad: return_data.razones_calidad,
				json: json,
				user: req.user
			});
		})
	});
		

	// =====================================
	// SUPERUSUARIO ========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	// TODO: Hacer que esta pagina solo se pueda ver para los usuarios con privilegios especiales
	app.get('/superusuario', isLoggedIn, function(req, res) {
		res.render('pages/superusuario.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// USER ================================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/usuario', isLoggedIn, function(req, res) {
		res.render('pages/usuario.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// CONFIGURACION =======================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/configuracion', isLoggedIn, function(req, res) {
		
		Eventos.getConfiguracion(function(err, return_data, json) {
			res.render("pages/configuracion.ejs",{
				plantas:return_data.plantas, 
				areas:return_data.areas, 
				maquinas:return_data.maquinas,
				productos:return_data.productos,
				razones:return_data.razones,
				calidad:return_data.calidad,
				turnos:return_data.turnos,
				users:return_data.users,
				user: req.user
			});
		})
	});

	// TODO: ver si se pueden cambiar todas estas configuraciones a promesas (mayor organizacion y estan fuera del routes.js)
	app.post('/configuracion', isLoggedIn, function(req, res) {
		// TODO: Agregar el que se inserten las notas donde convenga insertar
		var tipo = req.body.tipo;

		// TODO: Este codigo puede ser mejorado hay que refactorizarlo o modificarlo de plano
		switch(tipo) {
			case "agregarPlantas":
				var nombre = req.body.nombre;
				var notas = req.body.notas;
				var plantas  = {nombre: nombre, notas: notas, active: true};

				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO plantas SET ?', plantas).then(function(rows){

							// Suelta la conexion ejemplo: Connection 404 released
							//connection.release();
							// Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
							promisePool.releaseConnection(connection);

						//return_data.turnos = rows // Esta linea no sirve porque no se hace nada con las filas returnadas
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				});

				break;
			case "agregarAreas":
				var nombre = req.body.nombre
				var notas = req.body.notas
				var planta = req.body.planta
				var area  = {nombre: nombre, notas: notas, plantas_id: planta, active: true};

				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO areas SET ?', area).then(function(rows){

							// Suelta la conexion ejemplo: Connection 404 released
							//connection.release();
							// Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
							promisePool.releaseConnection(connection);

						//return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				});
				break;
			case "agregarMaquinas":
				var nombre = req.body.nombre
				var notas = req.body.notas
				var planta = req.body.planta
				var area = req.body.area
				var producto = req.body.producto

				var maquina  = {nombre: nombre, notas: notas, areas_id: area, productos_id: producto, active: true};
				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO maquinas SET ?', maquina).then(function(rows){

							// Suelta la conexion ejemplo: Connection 404 released
							//connection.release();
							// Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
							promisePool.releaseConnection(connection);

							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				});
				break;
			case "agregarProductos":
				var nombre = req.body.nombre
				var disponibilidad = req.body.disponibilidad
				var rendimiento = req.body.rendimiento
				var calidad = req.body.calidad
				var plantas_id = req.body.plantaId // TODO: Probar esta parte

				var producto  = {nombre: nombre, disponibilidad: disponibilidad, rendimiento: rendimiento, calidad: calidad, activo: true, plantas_id:plantas_id};
				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO productos SET ?', producto).then(function(rows){

							// Suelta la conexion ejemplo: Connection 404 released
							//connection.release();
							// Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
							promisePool.releaseConnection(connection);

							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				});
				break;
			case "agregarTurnos":
				var nombre = req.body.nombre
				var inicio = req.body.inicio
				var fin = req.body.fin
				var planta = req.body.planta

				promisePool.getConnection().then(function(connection) {
						connection.query("INSERT INTO turnos SET nombre = '"+ nombre +"', inicio = SEC_TO_TIME("+ inicio +"), fin = SEC_TO_TIME("+ fin +"), plantas_id = "+ planta+", activo = 1").then(function(rows){

							// Suelta la conexion ejemplo: Connection 404 released
							//connection.release();
							// Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
							promisePool.releaseConnection(connection);

							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				});
				break;
			case "agregarUsuarios":
				var username = req.body.username
				var password = req.body.password
				var email = req.body.email
				var role = req.body.role
				var nivel = req.body.nivel
				
				var usuario  = {username: username, password: password, email: email, role: role, nivel: nivel};
				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO users SET ?', usuario).then(function(rows){

							// Suelta la conexion ejemplo: Connection 404 released
							//connection.release();
							// Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
							promisePool.releaseConnection(connection);

							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				});
				break;
			default:
				console.log("default");
			
		}
	});

	app.post('/configuracion/modif-plantas-nombre', isLoggedIn, function(req, res) {

		Eventos.modificarNombrePlanta(req.body.pk, req.body.value, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})		
	});

	app.post('/configuracion/modif-areas-nombre', isLoggedIn, function(req, res) {

		Eventos.modificarNombreArea(req.body.pk, req.body.value, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})	
	});

	app.post('/configuracion/modif-maquinas-nombre', isLoggedIn, function(req, res) {
		
		Eventos.modificarNombreMaquina(req.body.pk, req.body.value, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	app.post('/configuracion/modif-maquinas-producto', isLoggedIn, function(req, res) {
		
		// TODO: hacer algo con el dropbox, algunas veces no funciona, checar!
		Eventos.modificarProductoMaquina(req.body.pk, req.body.value, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	/*
	* Borrar plantas - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/plantas/:plantaId', isLoggedIn, function(req, res) {
		
		Eventos.deletePlanta(req.params.plantaId, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	/*
	* Borrar areas - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/areas/:areaId', isLoggedIn, function(req, res) {
		
		Eventos.deleteArea(req.params.areaId, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	/*
	* Borrar maquinas - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/maquinas/:maquinaId', isLoggedIn, function(req, res) {
		

		Eventos.deleteMaquina(req.params.maquinaId, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	/*
	* Borrar productos - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/productos/:productoId', isLoggedIn, function(req, res) {
		

		Eventos.deleteProducto(req.params.productoId, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	/*
	* Borrar razones de paro - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/razones/:razonId', isLoggedIn, function(req, res) {
		
		Eventos.deleteRazonDeParo(req.params.razonId, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	/*
	* Borrar turnos - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/turnos/:turnoId', isLoggedIn, function(req, res) {
		
		Eventos.deleteTurno(req.params.turnoId, function(err, actualizado) {
			//console.log(actualizado)
			if (actualizado) {
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			} else {
				res.sendStatus(400); // Manda no ok si hubo algun error
			}
		})
	});

	// =====================================
	// OEE =================================
	// =====================================
	// Andon de 1 pantalla
	app.get('/oee', isLoggedIn, function(req, res) {
		// TODO: Mostrar algun mensaje o algo si el modelo regreso un error.
		Eventos.getReportesInfo(function(err, return_data, json) {
			res.render("pages/oee.ejs",{
				turnos: return_data.turnos,
				productos: return_data.productos,
				plantas: return_data.plantas,
				areas: return_data.areas,
				maquinas: return_data.maquinas,
				json: json,
				user: req.user
			});
		})
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	/*
	* Monitor 2
	*/
	app.get('/monitor2', function(req, res) {
		
		res.render("pages/monitor2.ejs");

	});

};

// route middleware to make sure
function isLoggedIn(req, res, next) {
	//console.log("verify is the user is authenticated")
	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}
