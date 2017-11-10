/*
* Comunicacion para toda la apliacion con Socket.io
* Todas las paginas pueden hacer uso de estos sockets
*/

// load up the user model
var mysql = require('mysql');
var dbconfig = require('../config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);

var promiseMysql = require('promise-mysql');
promisePool = promiseMysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'kinnil',
	connectionLimit: 25
});
promisePool.query('USE ' + dbconfig.database)

// define constructor function that gets `io` send to it
module.exports = function(io) {
    // When a client connects, we note it in the console
    io.sockets.on('connection', function (socket) {
        console.log('A client is connected!');
        socket.emit('message', 'alive');
        socket.emit('conectado', 'se conecto una tablet') // Hay que ver como casar la sesion para mandar el status de una sola tablet a la pagina web.
        
        // When the server receives a “message” type signal from the client   
        socket.on('message', function (message) {
            socket.emit('message', 'alive');
            console.log('A client is speaking to me! They’re saying: ' + message);
        });

        // When the server receives a “config” type signal from the client   
        socket.on('config', function (message) {
            if (message == "all"){
                
                var return_data = {}
                promisePool.getConnection().then(function(connection) {
        
                    // Primero obtiene el turno actual
                    connection.query("SELECT * FROM turnos").then(function(rows){
                        return_data.turnos = rows
                        // TODO: Hay que poner algo para que la fecha siempre sea el dia de hoy
                        var result = connection.query("select * from productos")
                        return result
                    }).then(function(rows) {
                        return_data.productos = rows
                        //console.log(return_data)
                        res.render("pages/rendimiento.ejs",{
                            turnos: return_data.turnos,
                            productos: return_data.productos,
                            user: req.user
                        });
                    }).catch(function(err) {
                        console.log(err);
                    });
                });

                // TODO: Hacer que esta configuacion se obtenga desde la DB y se mande como un json
                io.emit('config', '{"plantas": [{"planta": "Planta1-Chihuahua-Nave1", "areas": [{"nombre": "area 1", "maquinas": [{"nombre": "area1-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] }, {"nombre": "area 2", "maquinas": [{"nombre": "area2-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] } ], "turnos": [{"nombre": "primera", "inicio": "06:00", "fin": "15:00"}, {"nombre": "segunda", "inicio": "15:00", "fin": "21:00"}, {"nombre": "tercera", "inicio": "21:00", "fin": "06:00"} ] }, {"planta": "Planta1-Chihuahua-Nave2", "areas": [{"nombre": "area 1", "maquinas": [{"nombre": "area1-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] }, {"nombre": "area 2", "maquinas": [{"nombre": "area2-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] } ], "turnos": [{"nombre": "primera", "inicio": "06:00", "fin": "15:00"}, {"nombre": "segunda", "inicio": "15:00", "fin": "21:00"}, {"nombre": "tercera", "inicio": "21:00", "fin": "06:00"} ] } ] }'); // io.emit send a message to everione connected
                console.log('A client want to know the actual configuration: {"planta":"planta 1", "areas": [{ "nombre":"area 1", "maquinas":[{"nombre":"area1-maquina-1", "razones":["razon 1", "razon 2","razon 3"] }, {"nombre":"area1-maquina-2", "razones":["razon 1", "razon 2","razon 3"] }, {"nombre":"area1-maquina-3", "razones":["razon 1", "razon 2","razon 3"] } ] }, { "nombre":"area 2", "maquinas":[{"nombre":"area2-maquina-1", "razones":["razon 1", "razon 2","razon 3"] }, {"nombre":"area2-maquina-2", "razones":["razon 1", "razon 2","razon 3"] }, {"nombre":"area2-maquina-3", "razones":["razon 1", "razon 2","razon 3"] } ] } ], "turnos": [{ "nombre":"primera", "inicio":"06:00", "fin":"15:00" }, { "nombre":"segunda", "inicio":"15:00", "fin":"21:00" }, { "nombre":"tercera", "inicio":"21:00", "fin":"06:00" } ] }');
            }
        });

        // When the server receives a “config” type signal from the client   
        socket.on('evento', function (message) {
            var evento = JSON.parse(message);

            console.log(evento);

            var insertQuery = "INSERT INTO eventos ( operacion_uuid,maquinas_id,activo,razones_id,tiempo, fecha ) values (?,?,?,?,?,?)";

            created = new Date();
            console.log(connection.escape(created));
            //connection.query(insertQuery,[evento.operacion_uuid, evento.maquinas_id, evento.activo, evento.razones_id, evento.tiempo, STR_TO_DATE(connection.escape(created), '%m-%d-%y %h:%i:%s:%f')],function(err, result) {
            connection.query(insertQuery,[evento.operacion_uuid, evento.maquinas_id, evento.activo, evento.razones_id, evento.tiempo, '2017-10-09 17:38:17.685'],function(err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });

            // TODO: emitir el UUID
            socket.emit('evento', evento.operacion);

            // Actualiza la pagina inicio con el nuevo evento
            connection.query("select e.activo 'estado', m.nombre 'maquina', p.nombre 'producto' from eventos e, maquinas m, productos p where e.maquinas_id = m.id and p.maquinas_id = m.id",function(e,r){
                if (e)
                    return done(err);
                if (r.length) {
                    socket.emit('update-inicio', r);
                }
            });
            
        });

        // When the server receives a “config” type signal from the client   
        socket.on('register', function (message) {
            socket.emit('register', 'ok');
            console.log(message);
        });

        socket.on('inner', function(message) {
            socket.emit('inner', 'ok send everything to the fucking fuck');
        })

        socket.on('disconnect', (reason) => {
            console.log("alguien se desconecto por " + reason);
            socket.emit('desconectado', "se desconecto una tablet")
        });
    });

};

