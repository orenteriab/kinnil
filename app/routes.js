// app/routes.js

// load up the user model
var mysql = require('mysql');
var async = require('async');
var dbconfig = require('../config/database');
var pool = mysql.createPool(dbconfig.connection);
pool.query('USE ' + dbconfig.database);

var promiseMysql = require('promise-mysql');
promisePool = promiseMysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
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
		
		
		pool.query("select e.activo 'estado', m.nombre 'maquina', p.nombre 'producto' \
							from eventos e, maquinas m, productos p  \
							where e.maquinas_id = m.id  \
							order by e.id limit 1",function(e,r){

			res.render("pages/index.ejs",{eventos:r, user: req.user})
		});
		
	});

	// =====================================
	// DISPONIBILIDAD ======================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/disponibilidad', isLoggedIn, function(req, res) {
		//console.log("empece con el get")
		var return_data = {}
		promisePool.getConnection().then(function(connection) {
			// Primero obtiene el turno actual
			connection.query("select * from turnos where activo = true").then(function(rows){
				return_data.turnos = rows
				//console.log("primera promesa")
				var result = connection.query("select * from productos where activo = true")
				return result
			}).then(function(rows){
				return_data.productos = rows
				//console.log("segunda promesa")
				var result = connection.query("select * from plantas where active = true")
				return result
			}).then(function(rows){
				return_data.plantas = rows
				//console.log("tercera promesa")
				var result = connection.query("select * from areas where active = true")
				return result
			}).then(function(rows){
				return_data.areas = rows
				//console.log("cuarda promesa")
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

	app.post('/disponibilidad', isLoggedIn, function(req, res) {

		var planta = req.body.planta
		var area = req.body.area
		var turno = req.body.turno
		var productos = req.body.producto
		var inicio = req.body.inicio
		var fin = req.body.fin
		var horaInicio = req.body.horaInicio/60/60
		var horaFin = req.body.horaFin/60/60
		var tipo = req.body.tipo

		var where = " WHERE (e.fecha BETWEEN " + inicio + " AND " + fin + ")"

		if (planta != "all") {
			where += " AND e.plantas_id =" + planta
		}
		if (area != "all") {
			where += " AND e.areas_id =" + area
		}
		if (tipo == "hora") {
			// TODO Logica para agregar la hora transformada de los segundos.
		}
		if (tipo == "producto") {
			// TODO Logica para los productos
		}

		var return_data = {}
		promisePool.getConnection().then(function(connection) {
			// Primero obtiene el turno actual
			connection.query("select * from turnos where activo = true").then(function(rows){
				return_data.turnos = rows
				// TODO: obtener el id del selected turno.

				var result = connection.query("SELECT sum(e.tiempo) 'ta' FROM eventos2 e " + where + "  and e.activo = true")
				return result
			}).then(function(rows){
				return_data.ta = rows
				//console.log("segunda promesa")
				var result = connection.query("SELECT sum(e.tiempo) 'ta' FROM eventos2 e " + where + "  and e.activo = false")
				return result
			}).then(function(rows){
				return_data.tm = rows
				//console.log("tercera promesa")
				var result = connection.query("SELECT sum(e.tiempo) 'tm', r.nombre 'nombre' FROM eventos2 e JOIN razones_paro r ON e.razones_paro_id = r.id" + where + "  and e.activo = false")
				return result
			}).then(function(rows){
				return_data.tm_desglose = rows
				console.log(return_data)
				res.render("pages/disponibilidad-resultado.ejs",{ // TODO:no se puede mandar a la misma pagina, tengo que ver otra manera
					ta: return_data.ta,
					tm: return_data.tm,
					tm_desglose: return_data.tm_desglose,
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
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select * from productos where activo = true")
				return result
			}).then(function(rows){
				return_data.productos = rows
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select * from plantas where active = true")
				return result
			}).then(function(rows){
				return_data.plantas = rows
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select * from areas where active = true")
				return result
			}).then(function(rows) {
				return_data.areas = rows
				//console.log(return_data)
				res.render("pages/rendimiento.ejs",{
					turnos: return_data.turnos,
					productos: return_data.productos,
					plantas: return_data.plantas,
					areas: return_data.areas,
					user: req.user
				});
			}).catch(function(err) {
				console.log(err);
			});
		});
	});

	//rendimiento post
	app.post('/rendimiento', isLoggedIn, function(req, res) {

		// TODO: Hay que mandar los detalles de las plantas, asi tal cual como cuando se le manda la configuracion a la electronica

		console.log("post para rendimiento")
		console.log(req.body.turno)
		console.log(req.body.producto)
		console.log(req.body.inicio)
		console.log(req.body.fin)
		console.log(req.body.horaInicio/60/60)
		console.log(req.body.horaFin/60/60)
		console.log(req.body.tipo)

		
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
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select * from productos where activo = true")
				return result
			}).then(function(rows){
				return_data.productos = rows
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select * from plantas where active = true")
				return result
			}).then(function(rows){
				return_data.plantas = rows
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select * from areas where active = true")
				return result
			}).then(function(rows) {
				return_data.areas = rows
				//console.log(return_data)
				res.render("pages/calidad.ejs",{
					turnos: return_data.turnos,
					productos: return_data.productos,
					plantas: return_data.plantas,
					areas: return_data.areas,
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
						connection.query("INSERT INTO turnos SET nombre = '"+ nombre +"', inicio = SEC_TO_TIME("+ inicio +"), fin = SEC_TO_TIME("+ fin +"), plantas_id = "+ planta).then(function(rows){
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
				console.log(err);
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
	* Monitor
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
			// Primero obtiene el turno actual
			connection.query("SELECT * FROM turnos where inicio < STR_TO_DATE('" + horaActual + "','%H.%i.%s') and fin > STR_TO_DATE('" + horaActual + "','%H.%i.%s')").then(function(rows){
				return_data.turnoActual = rows
				// TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
				var result = connection.query("select ( \
					SELECT sum(tiempo) \
					FROM eventos \
					WHERE fecha = STR_TO_DATE('2017.10.28','%Y.%m.%d') \
					AND hora >= STR_TO_DATE('"+ rows[0].inicio +"','%H:%i:%s') \
					AND hora < STR_TO_DATE('"+ rows[0].fin +"','%H:%i:%s') \
					AND activo = 1 \
					AND maquinas_id = 1) as 'activo', \
					(SELECT sum(tiempo) \
					FROM eventos \
					WHERE fecha = STR_TO_DATE('2017.10.28','%Y.%m.%d') \
					AND hora >= STR_TO_DATE('"+ rows[0].inicio +"','%H:%i:%s') \
					AND hora < STR_TO_DATE('"+ rows[0].fin +"','%H:%i:%s') \
					AND activo = 0 \
					AND maquinas_id = 1) as 'inactivo'")
				return result
			}).then(function(rows){ // Maquina (con producto)
				return_data.tiempo = rows // se agrega las filas que regreso la anterior promesa el arreglo return_data
				// Las maquinas ya tienen asociadas el producto que estan trabajando.
				var result = connection.query("SELECT m.nombre maquina, p.nombre producto \
					FROM maquinas m, productos p \
					WHERE m.id = 1 and m.productos_id = p.id") // TODO: modificar para obtener la informacion de mas maquinas Para utilizar esto en la version de mas pantallas

				return result
			}).then(function(rows){ // Estado (activo/inactivo)
				return_data.maquinas = rows
				// Las maquinas ya tienen asociadas el producto que estan trabajando.
				var result = connection.query("SELECT e.activo, r.nombre \
					FROM eventos e \
					INNER JOIN razones_paro r ON e.razones_id = r.id \
					WHERE e.maquinas_id = 1 \
					ORDER BY e.id DESC LIMIT 1") 
					
				return result
			}).then(function(rows){ // Kgs buenos query
				return_data.estado = rows
				// Las maquinas ya tienen asociadas el producto que estan trabajando.
				// TODO: Hacer que este query haga la conversion del cuenta metros a kgs dependiendo del producto
				// TODO: o ver si es necesario guardar la como kgs en la tabla de eventos dependiendo del tipo de producto
				var result = connection.query("SELECT sum(valor) 'valor' \
					FROM eventos \
					WHERE fecha = STR_TO_DATE('2017.10.28','%Y.%m.%d') \
					AND hora >= STR_TO_DATE('"+ return_data.turnoActual[0].inicio +"','%H:%i:%s') \
					AND hora < STR_TO_DATE('"+ return_data.turnoActual[0].fin +"','%H:%i:%s') \
					AND activo = 1 \
					AND maquinas_id = 1") 

				return result
			}).then(function(rows){ // Rendimiento query
				return_data.kgsbuenos = rows

				var result = connection.query("select sum(x.valor)/count(*)*100 as valor from \
					(select sum(e.valor)/sum(e.tiempo)*60*60 as 'mtsh', \
					p.rendimiento 'rendprod', \
					(sum(e.valor)/sum(e.tiempo)*60*60) / (p.rendimiento ) 'valor' \
					from eventos e \
					inner join productos p on e.productos_id = p.id \
					WHERE e.fecha = STR_TO_DATE('2017.10.28','%Y.%m.%d') \
					AND e.hora >= STR_TO_DATE('"+ return_data.turnoActual[0].inicio +"','%H:%i:%s') \
					AND e.hora < STR_TO_DATE('"+ return_data.turnoActual[0].fin +"','%H:%i:%s') \
					AND e.activo = 1 \
					group by productos_id) x") 

				return result
			}).then(function(rows){ // Calidad query
				return_data.rendimiento = rows

				var result = connection.query("select sum(x.valor)/count(*) 'valor' from \
				(select sum(e.valor)*100 / (sum(e.valor)) 'valor' \
				from eventos e \
				inner join productos p on e.productos_id = p.id \
				WHERE e.fecha = STR_TO_DATE('2017.10.28','%Y.%m.%d') \
				AND e.hora >= STR_TO_DATE('"+ return_data.turnoActual[0].inicio +"','%H:%i:%s') \
				AND e.hora < STR_TO_DATE('"+ return_data.turnoActual[0].fin +"','%H:%i:%s') \
				AND e.activo = 1 \
				group by productos_id) x")

				connection.release();
				return result
			}).then(function(rows) {
				return_data.calidad = rows
				console.log(return_data)
				res.render("pages/monitor.ejs",{
					turnoActual:return_data.turnoActual,
					tiempo:return_data.tiempo,
					maquinas:return_data.maquinas,
					estado: return_data.estado,
					kgsbuenos: return_data.kgsbuenos,
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
