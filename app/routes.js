// app/routes.js

// load up the user model
var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/database');
var pool = mysql.createPool(dbconfig.connection);
pool.query('USE ' + dbconfig.database);

// TODO: modificar esto, se tienen las variables para logearse a mysql en varias partes, hay que ponerlas solo en un lugar
var promiseMysql = require('promise-mysql');
promisePool = promiseMysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'FundableD0ubles',
	database: 'kinnil',
	connectionLimit: 25
});
promisePool.query('USE ' + dbconfig.database)

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
            //console.log("hello");
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
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('pages/profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});

	// =====================================
	// INICIO =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/inicio', isLoggedIn, function(req, res) {
		
		res.render("pages/index.ejs",{
			user: req.user
		})
		
	});

	// =====================================
	// DISPONIBILIDAD ======================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/disponibilidad', isLoggedIn, function(req, res) {
		
		var return_data = {}
		promisePool.getConnection().then(function(connection) {
			// Primero obtiene el turno actual
			connection.query("select * from turnos where activo = true").then(function(rows){
				return_data.turnos = rows
				
				var result = connection.query("select * from productos where activo = true")
				return result
			}).then(function(rows){
				return_data.productos = rows
				
				var result = connection.query("select * from plantas where active = true")
				return result
			}).then(function(rows){
				return_data.plantas = rows
				
				var result = connection.query("select * from areas where active = true")
				return result
			}).then(function(rows){
				return_data.areas = rows
				
				// Se separan los datos obtenidos de los queries.
				var plantas = return_data.plantas
				var areas = return_data.areas
				var turnos = return_data.turnos
				var productos = return_data.productos


				// TODO: ver si se puede utilizar una de estas formas para hacer mas rapido este pedo y delegar las operaciones a otro modulo
				/*https://github.com/kyleladd/node-mysql-nesting
				http://bender.io/2013/09/22/returning-hierarchical-data-in-a-single-sql-query/
				http://blog.tcs.de/creating-trees-from-sql-queries-in-javascript/*/

				// Objeto donde se va a guardar toda la confirguacion.
				var json = {plantas : []}

				// Arma un json con las plantas las areas productos y turnos para mandarlo a la pagina.
				// TODO: hay que checar esta funcion porque ya me dio un error TypeError: Cannot read property 'plantas_id' of undefinedat c:\projects\kinnil\app\routes.js:158:19
				for (var x = 0; x<plantas.length; x++){
					planta = plantas[x]
					json.plantas.push({"id": planta.id, "nombre": planta.nombre, "areas": [], "turnos": [], "productos": []}) // Se agrega un objeto con el nombre de cada planta y area (2do nivel)

					for (var y = 0; y<areas.length; y++){ // Se recorren todas las areas
						area = areas[y]

						if (area.plantas_id == planta.id){ // Si el area le pertenece a la planta en turno
							json.plantas[x].areas.push({"id": area.id, "nombre":area.nombre, maquinas: []}) // Se agrega el area a la planta en turno (3er nivel)
						}
					}
					for (var b = 0; b<turnos.length; b++){
						turno = turnos[b]

						if (turno.plantas_id == planta.id){
							json.plantas[x].turnos.push({"id": turno.id, "nombre": turno.nombre})
						}
					}
					for (var c = 0; c<productos.length; c++){
						producto = productos[b]

						if (producto.plantas_id == planta.id){
							json.plantas[x].productos.push({"id": producto.id, "nombre": producto.nombre})
						}
					}
				}

				res.render("pages/disponibilidad.ejs",{
					turnos: return_data.turnos,
					productos: return_data.productos,
					plantas: return_data.plantas,
					areas: return_data.areas,
					json: json,
					user: req.user
				});
			}).catch(function(err) {
				console.log(err);
			});
		});
	});

	// =====================================
	// RENDIMIENTO =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/rendimiento', isLoggedIn, function(req, res) {
		var return_data = {}
		promisePool.getConnection().then(function(connection) {
			// Primero obtiene el turno actual
			connection.query("select * from turnos where activo = true").then(function(rows){
				return_data.turnos = rows
				
				var result = connection.query("select * from productos where activo = true")
				return result
			}).then(function(rows){
				return_data.productos = rows
				
				var result = connection.query("select * from plantas where active = true")
				return result
			}).then(function(rows){
				return_data.plantas = rows
				
				var result = connection.query("select * from areas where active = true")
				return result
			}).then(function(rows){
				return_data.areas = rows
				
				// Se separan los datos obtenidos de los queries.
				var plantas = return_data.plantas
				var areas = return_data.areas
				var turnos = return_data.turnos
				var productos = return_data.productos


				// TODO: ver si se puede utilizar una de estas formas para hacer mas rapido este pedo y delegar las operaciones a otro modulo
				/*https://github.com/kyleladd/node-mysql-nesting
				http://bender.io/2013/09/22/returning-hierarchical-data-in-a-single-sql-query/
				http://blog.tcs.de/creating-trees-from-sql-queries-in-javascript/*/

				// Objeto donde se va a guardar toda la confirguacion.
				var json = {plantas : []}

				// Arma un json con las plantas las areas productos y turnos para mandarlo a la pagina.
				for (var x = 0; x<plantas.length; x++){
					planta = plantas[x]
					json.plantas.push({"id": planta.id, "nombre": planta.nombre, "areas": [], "turnos": [], "productos": []}) // Se agrega un objeto con el nombre de cada planta y area (2do nivel)

					for (var y = 0; y<areas.length; y++){ // Se recorren todas las areas
						area = areas[y]

						if (area.plantas_id == planta.id){ // Si el area le pertenece a la planta en turno
							json.plantas[x].areas.push({"id": area.id, "nombre":area.nombre, maquinas: []}) // Se agrega el area a la planta en turno (3er nivel)
						}
					}
					for (var b = 0; b<turnos.length; b++){
						turno = turnos[b]

						if (turno.plantas_id == planta.id){
							json.plantas[x].turnos.push({"id": turno.id, "nombre": turno.nombre})
						}
					}
					for (var c = 0; c<productos.length; c++){
						producto = productos[b]

						if (producto.plantas_id == planta.id){
							json.plantas[x].productos.push({"id": producto.id, "nombre": producto.nombre})
						}
					}
				}

				res.render("pages/rendimiento.ejs",{
					turnos: return_data.turnos,
					productos: return_data.productos,
					plantas: return_data.plantas,
					areas: return_data.areas,
					json: json,
					user: req.user
				});
			}).catch(function(err) {
				console.log(err);
			});
		});
	});

	// =====================================
	// CALIDAD =============================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/calidad', isLoggedIn, function(req, res) {

		var return_data = {}
		promisePool.getConnection().then(function(connection) {
			// Primero obtiene el turno actual
			connection.query("select * from turnos where activo = true").then(function(rows){
				return_data.turnos = rows
				
				var result = connection.query("select * from productos where activo = true")
				return result
			}).then(function(rows){
				return_data.productos = rows
				
				var result = connection.query("select * from plantas where active = true")
				return result
			}).then(function(rows){
				return_data.plantas = rows
				
				var result = connection.query("select * from areas where active = true")
				return result
			}).then(function(rows){
				return_data.areas = rows
				
				// Se separan los datos obtenidos de los queries.
				var plantas = return_data.plantas
				var areas = return_data.areas
				var turnos = return_data.turnos
				var productos = return_data.productos


				// TODO: ver si se puede utilizar una de estas formas para hacer mas rapido este pedo y delegar las operaciones a otro modulo
				/*https://github.com/kyleladd/node-mysql-nesting
				http://bender.io/2013/09/22/returning-hierarchical-data-in-a-single-sql-query/
				http://blog.tcs.de/creating-trees-from-sql-queries-in-javascript/*/

				// Objeto donde se va a guardar toda la confirguacion.
				var json = {plantas : []}

				// Arma un json con las plantas las areas productos y turnos para mandarlo a la pagina.
				for (var x = 0; x<plantas.length; x++){
					planta = plantas[x]
					json.plantas.push({"id": planta.id, "nombre": planta.nombre, "areas": [], "turnos": [], "productos": []}) // Se agrega un objeto con el nombre de cada planta y area (2do nivel)

					for (var y = 0; y<areas.length; y++){ // Se recorren todas las areas
						area = areas[y]

						if (area.plantas_id == planta.id){ // Si el area le pertenece a la planta en turno
							json.plantas[x].areas.push({"id": area.id, "nombre":area.nombre, maquinas: []}) // Se agrega el area a la planta en turno (3er nivel)
						}
					}
					for (var b = 0; b<turnos.length; b++){
						turno = turnos[b]

						if (turno.plantas_id == planta.id){
							json.plantas[x].turnos.push({"id": turno.id, "nombre": turno.nombre})
						}
					}
					for (var c = 0; c<productos.length; c++){
						producto = productos[b]

						if (producto.plantas_id == planta.id){
							json.plantas[x].productos.push({"id": producto.id, "nombre": producto.nombre})
						}
					}
				}

				res.render("pages/calidad.ejs",{
					turnos: return_data.turnos,
					productos: return_data.productos,
					plantas: return_data.plantas,
					areas: return_data.areas,
					json: json,
					user: req.user
				});
			}).catch(function(err) {
				console.log(err);
			});
		});
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

		promisePool.query('USE ' + dbconfig.database) // Workaround al problema de no database selected
		///// TODO: homologar el activo active en todas las tablas, no puede estar diferente.
		var plantasQuery = "SELECT * FROM plantas WHERE active = true";
		var areasQuery = "SELECT a.id 'id', a.nombre 'nombre', a.notas 'notas', p.id 'p_id', p.nombre 'planta' FROM areas a INNER JOIN plantas p ON a.plantas_id = p.id and a.active=true"; // TODO: agregar el where active = true
		var maquinasQuery = "SELECT m.id 'id', m.nombre 'nombre', m.notas 'notas', a.nombre 'area', p.id 'productos_id', p.nombre 'producto' FROM maquinas m INNER JOIN areas a ON m.areas_id = a.id INNER JOIN productos p ON m.productos_id = p.id WHERE m.active = true";
		var razonesQuery = "SELECT r.id 'id', r.nombre 'nombre', m.nombre 'maquina' FROM razones_paro r INNER JOIN maquinas m ON r.maquinas_id = m.id WHERE r.active = true";
		var calidadQuery = "SELECT r.id 'id', r.nombre 'nombre', m.nombre 'maquina' FROM razones_calidad r INNER JOIN maquinas m ON r.maquinas_id = m.id WHERE r.activo = true";
		var productosQuery = "SELECT * FROM productos";
		var turnosQuery = "SELECT t.id 'id', t.nombre 'nombre', t.inicio 'inicio', t.fin 'fin', p.nombre 'planta' FROM turnos t INNER JOIN plantas p ON t.plantas_id = p.id WHERE t.activo = true";
		//var alertasQuery = "SELECT * FROM alertas"; ///// TODO: Esto hay que programarlo con un cron o algo asi-----
		var usersQuery = "SELECT * FROM users";

		var return_data = {};

		// TODO: Cambiar esta forma de conexion mysql no esta trabajando con promesas aqui
		pool.getConnection(function (err, connection) {
			async.parallel([
				function(parallel_done) {
					connection.query(plantasQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.plantas = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(areasQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.areas = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(maquinasQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.maquinas = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(razonesQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.razones = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(calidadQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.calidad = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(productosQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.productos = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(turnosQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.turnos = results;
						parallel_done();
					});
				},
				function(parallel_done) {
					connection.query(usersQuery, {}, function(err, results) {
						if (err) return parallel_done(err);
						return_data.users = results;
						parallel_done();
					});
				}
			], function(err) {
				if (err) console.log(err);
				connection.release();
				//console.log(return_data)
				res.render("pages/configuracion.ejs",{
					plantas:return_data.plantas, 
					areas:return_data.areas, 
					maquinas:return_data.maquinas,
					productos:return_data.productos,
					razones:return_data.razones,
					calidad:return_data.calidad,
					tablets:return_data.tablets,
					turnos:return_data.turnos,
					users:return_data.users,
					user: req.user});
			});
		});


	});

	app.post('/configuracion', isLoggedIn, function(req, res) {
		// TODO: Agregar el que se inserten las notas donde convenga insertar
		var tipo = req.body.tipo;

		switch(tipo) {
			case "agregarPlantas":
				var nombre = req.body.nombre;
				var notas = req.body.notas;
				var plantas  = {nombre: nombre, notas: notas, active: true};

				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO plantas SET ?', plantas).then(function(rows){
						//return_data.turnos = rows // Esta linea no sirve porque no se hace nada con las filas returnadas
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
				connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
				});

				break;
			case "agregarAreas":
				var nombre = req.body.nombre
				var notas = req.body.notas
				var planta = req.body.planta
				var area  = {nombre: nombre, notas: notas, plantas_id: planta, active: true};

				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO areas SET ?', area).then(function(rows){
						return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
					connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
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
							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
					connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
				});
				break;
			case "agregarProductos":
				var nombre = req.body.nombre
				var disponibilidad = req.body.disponibilidad
				var rendimiento = req.body.rendimiento
				var calidad = req.body.calidad

				var producto  = {nombre: nombre, disponibilidad: disponibilidad, rendimiento: rendimiento, calidad: calidad, activo: true};
				promisePool.getConnection().then(function(connection) {
						connection.query('INSERT INTO productos SET ?', producto).then(function(rows){
							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
					connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
				});
				break;
			case "agregarTurnos":
				var nombre = req.body.nombre
				var inicio = req.body.inicio
				var fin = req.body.fin
				var planta = req.body.planta

				promisePool.getConnection().then(function(connection) {
						connection.query("INSERT INTO turnos SET nombre = '"+ nombre +"', inicio = SEC_TO_TIME("+ inicio +"), fin = SEC_TO_TIME("+ fin +"), plantas_id = "+ planta+", activo = 1").then(function(rows){
							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
					connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
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
							// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
							// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
							// return_data.turnos = rows
					}).catch(function(err) {
						// TODO: cambiar los console.log por un buen sistema de logueo de errores
						console.log(err);
					});
					connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
				});
				break;
			default:
				console.log("default");
			
		}
	});

	app.post('/configuracion/modif-plantas-nombre', isLoggedIn, function(req, res) {
		
		var pk = req.body.pk;
		var value = req.body.value;
	
		//console.log("apenas se hiso el post")
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE plantas SET nombre ="' + value + '" where id = ' + pk).then(function(rows){
					// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
					// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
					// return_data.turnos = rows
			}).then(function(rows) {
				//console.log("se armo si se inserto la informacion bien");
				res.sendStatus(200); // Manda una respuesta OK, si si se pudo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err); // TODO: Cambiar esto para que no se logue con logs normales, tiene que haber otra opcion que sea facil
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	app.post('/configuracion/modif-areas-nombre', isLoggedIn, function(req, res) {
		
		var pk = req.body.pk;
		var value = req.body.value;
	
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE areas SET nombre ="' + value + '" where id = ' + pk).then(function(rows){
					// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
					// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
					// return_data.turnos = rows
			}).then(function(rows) {

				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	app.post('/configuracion/modif-maquinas-nombre', isLoggedIn, function(req, res) {
		
		var pk = req.body.pk;
		var value = req.body.value;
	
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE maquinas SET nombre ="' + value + '" where id = ' + pk).then(function(rows){
					// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
					// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
					// return_data.turnos = rows
			}).then(function(rows) {

				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	app.post('/configuracion/modif-maquinas-producto', isLoggedIn, function(req, res) {
		
		var pk = req.body.pk;
		var value = req.body.value;
	
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE maquinas SET productos_id ="' + value + '" where id = ' + pk).then(function(rows){
					// TODO: crear las razones de paro para ese producto. Insertar las en la DB, todas las que sean default. poner una area para definir las default.....!?
					// TODO: ver si agregar un area para definir las razones de calidad, y ver si se tienen que inertar por default, preguntar a ricardo
					// return_data.turnos = rows
			}).then(function(rows) {

				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	/*
	* Borrar plantas - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/plantas/:plantaId', isLoggedIn, function(req, res) {
		
		var pk = req.params.plantaId;
		
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE plantas SET active = 0 where id = ' + pk).then(function(rows){
			}).then(function(rows) {
				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	/*
	* Borrar areas - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/areas/:areaId', isLoggedIn, function(req, res) {
		
		var pk = req.params.areaId;
		
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE areas SET active = 0 where id = ' + pk).then(function(rows){
			}).then(function(rows) {
				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	/*
	* Borrar maquinas - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/maquinas/:maquinaId', isLoggedIn, function(req, res) {
		
		var pk = req.params.maquinaId;
		
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE maquinas SET active = 0 where id = ' + pk).then(function(rows){
			}).then(function(rows) {
				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	/*
	* Borrar productos - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/productos/:productoId', isLoggedIn, function(req, res) {
		
		var pk = req.params.productoId;
		
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE productos SET activo = 0 where id = ' + pk).then(function(rows){ // TODO cambiar activo a active.!
			}).then(function(rows) {
				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	/*
	* Borrar turnos - solo las desactivamos :) (active = false in MySql)
	*/
	app.delete('/configuracion/turnos/:turnoId', isLoggedIn, function(req, res) {
		
		var pk = req.params.turnoId;
		
		promisePool.getConnection().then(function(connection) {
			connection.query('UPDATE turnos SET activo = 0 where id = ' + pk).then(function(rows){ // TODO cambiar activo a active.!
			}).then(function(rows) {
				res.sendStatus(200); // Devuelve una respuesta 200 si si se puedo actualizar la fila
			}).catch(function(err) {
				// TODO: cambiar los console.log por un buen sistema de logueo de errores
				res.sendStatus(400);
				console.log(err);
			});
			connection.release(); // TODO: ver que el codigo si llegue a esta parte y que se cierre la conexion
		});
	});

	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	/*
	* Monitor, TODO: Fix it 
	*/
	app.get('/monitor', function(req, res) {
		var return_data = {}
		promisePool.query('USE ' + dbconfig.database) // Workaround al problema de no database selected
		promisePool.getConnection().then(function(connection) {
			// TODO: hay que hacer 
			var d = new Date()
			var h = d.getHours()
			var m = d.getMinutes()
			var s = d.getSeconds()
			var horaActual = h + "." + m + "." + s
			// TODO: Si no hay turnos, todos los siguientes queries dan undefined. Hay que comprobar que el turno actual es valido antes de hacer todo esto
			// TODO: Hacer algo!!! -> Se muestra la ultima informacion guardada en la DB (activo/inactivo) Pero de eso pudo haber pasado mucho rato si no se ha agregado un cambio nuevo (necesitare agregar algo que verifique el ultimo estatus?????)
			// Turno actual, nos va a servir para obtener la informacion del turno en cuestion
			connection.query("SELECT * FROM turnos where inicio < STR_TO_DATE('" + horaActual + "','%H.%i.%s') and fin > STR_TO_DATE('" + horaActual + "','%H.%i.%s')").then(function(rows){
				return_data.turnoActual = rows
				
				// TA, TM, Disponibillidad Real, Sin disponibilidad Meta. Agrupado por maquina
				var result = connection.query("select maquinas_id, sum(case when activo=1 then tiempo else 0 end) ta, \
				sum(case when activo=0 then tiempo else 0 end) tm, \
				sum(case when activo=1 then tiempo else 0 end) / sum(case when activo=0 then tiempo else 0 end) disponibilidad \
				from eventos2 e \
				where e.fecha = CURDATE() \
				and e.hora >= STR_TO_DATE('"+ return_data.turnoActual[0].inicio +"','%H:%i:%s') \
				and e.hora < STR_TO_DATE('"+ return_data.turnoActual[0].fin +"','%H:%i:%s') \
				group by maquinas_id") 
				return result
			}).then(function(rows){
				return_data.disponibilidad = rows
				// TODO: Agrer el active = 1 a todos estos queries para evitar informacion inutil
				// Informacion agrupada por maquina (id del eventos2, activo, razon, producto, maquina)
				var result = connection.query("select e.maquinas_id as maquina, e.id as id, e.activo as activo, r.nombre as razon, p.nombre as producto \
				from (SELECT maquinas_id, max(id) as id \
					FROM eventos2 \
					group by maquinas_id) as x \
				inner join eventos2 e on x.id = e.id \
				inner join razones_paro r on r.id = e.razones_paro_id \
				inner join productos p on e.productos_id = p.id") 
					
				return result
			}).then(function(rows){ 
				return_data.estado = rows
				// TODO: Estos queries cuando no regresan filas en el template ejs me aparece como undefined y no se despliega un buen resultado
				// Rendimiento agrupado por maquina
				var result = connection.query("select e.maquinas_id maquina, \
				sum(e.valor) piezas, \
				sum(e.tiempo) tiempo, \
				sum(e.valor)/(sum(e.tiempo)/60/60) 'real', \
				(sum(e.valor)/(sum(e.tiempo)/60/60))/p.rendimiento rendimiento \
				from eventos2 e \
				inner join productos p on e.productos_id = p.id \
				where e.fecha = CURDATE() \
				and e.hora >= STR_TO_DATE('"+ return_data.turnoActual[0].inicio +"','%H:%i:%s') \
				and e.hora < STR_TO_DATE('"+ return_data.turnoActual[0].fin +"','%H:%i:%s') \
				group by e.maquinas_id") 
				return result
			}).then(function(rows){ 
				return_data.rendimiento = rows

				// Calidad agrupada por maquina
				// TODO: le falta guiarce con el turno actual. etc
				var result = connection.query("select e.maquinas_id id, sum(e.valor) calidad\
				from eventos2 e \
				where e.fecha = CURDATE() \
				and e.hora >= STR_TO_DATE('"+ return_data.turnoActual[0].inicio +"','%H:%i:%s') \
				and e.hora < STR_TO_DATE('"+ return_data.turnoActual[0].fin +"','%H:%i:%s') \
				group by e.maquinas_id")
				connection.release();
				return result
			}).then(function(rows) {
				return_data.calidad = rows

				console.log(return_data)
				res.render("pages/monitor.ejs",{
					turnoActual:return_data.turnoActual,
					estado: return_data.estado,
					disponibilidad:return_data.disponibilidad,
					rendimiento: return_data.rendimiento,
					calidad: return_data.calidad
				});
			}).catch(function(err) {
				console.log(err);
			});
		});

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
