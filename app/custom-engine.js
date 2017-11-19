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
                    // TODO: hay que probar si funciona este codigo, con jossie
                    // TODO: montar el servidor de prueba eternamente
                    connection.query("select * from turnos where activo = true").then(function(rows){
                        return_data.turnos = rows
                        
                        var result = connection.query("select * from plantas where active = true")
                        return result
                    }).then(function(rows){
                        return_data.plantas = rows
                        
                        var result = connection.query("select * from areas where active = true")
                        return result
                    }).then(function(rows){
                        return_data.areas = rows
                        
                        var result = connection.query("select * from maquinas where active = true")
                        return result
                    }).then(function(rows){
                        return_data.maquinas = rows
                        
                        var result = connection.query("select * from razones_paro where active = true")
                        return result
                    }).then(function(rows) {
                        return_data.razones_paro = rows
                        
                        // Se separan los datos obtenidos de los queries
                        var plantas = return_data.plantas
                        var areas = return_data.areas
                        var maquinas = return_data.maquinas
                        var razones_paro =return_data.razones_paro
                        var turnos = return_data.turnos
        
                        // Objeto donde se va a guardar toda la confirguacion.
                        // TODO: hay que agregar el id a cada elemento para que Jossie me regrese puros Ids que esten en la base de datos
                        var json = {plantas : []}
        
                        for (var x = 0; x<plantas.length; x++){
                            planta = plantas[x]
                            json.plantas.push({"nombre": planta.nombre, "areas": [], "turnos": []}) // Se agrega un objeto con el nombre de cada planta y area (2do nivel)
        
                            for (var y = 0; y<areas.length; y++){ // Se recorren todas las areas
                                area = areas[y]
        
                                if (area.plantas_id == planta.id){ // Si el area le pertenece a la planta en turno
                                    json.plantas[x].areas.push({"nombre":area.nombre, maquinas: []}) // Se agrega el area a la planta en turno (3er nivel)
        
                                    for (var z = 0; z<maquinas.length; z++){ // Se recorren todas las maquinas
                                        var maquina = maquinas[z]
        
                                        if (maquina.areas_id == area.id) // Si la maquina pertenece al area en turno
                                        {
                                            json.plantas[x].areas[y].maquinas.push({"nombre": maquina.nombre, razones: []}) // Se agrega la maquina al area en turno (4to nivel)
        
                                            for (var a = 0; a<razones_paro.length; a++){ // Se recorren todas las razones de paro
                                                var razon_paro = razones_paro[a]
        
                                                if (razon_paro.maquinas_id == maquina.id){ // Si la razon de paro pertenece a la maquina en turno 
                                                    json.plantas[x].areas[y].maquinas[z].razones.push(razon_paro.nombre) // Se agrega la razon de paro a la maquina en turno (5to nivel)
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            for (var b = 0; b<turnos.length; b++){
                                turno = turnos[b]
        
                                if (turno.plantas_id == planta.id){
                                    json.plantas[x].turnos.push({"nombre": turno.nombre, "inicio":turno.inicio, "fin":turno.fin})
                                }
                            }
                        }
                    
                        // Anterior emit ---- se guarda para pruebas solamente
                        //io.emit('config', '{"plantas": [{"planta": "Planta1-Chihuahua-Nave1", "areas": [{"nombre": "area 1", "maquinas": [{"nombre": "area1-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] }, {"nombre": "area 2", "maquinas": [{"nombre": "area2-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] } ], "turnos": [{"nombre": "primera", "inicio": "06:00", "fin": "15:00"}, {"nombre": "segunda", "inicio": "15:00", "fin": "21:00"}, {"nombre": "tercera", "inicio": "21:00", "fin": "06:00"} ] }, {"planta": "Planta1-Chihuahua-Nave2", "areas": [{"nombre": "area 1", "maquinas": [{"nombre": "area1-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area1-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] }, {"nombre": "area 2", "maquinas": [{"nombre": "area2-maquina-1", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-2", "razones": ["razon 1", "razon 2", "razon 3"] }, {"nombre": "area2-maquina-3", "razones": ["razon 1", "razon 2", "razon 3"] } ] } ], "turnos": [{"nombre": "primera", "inicio": "06:00", "fin": "15:00"}, {"nombre": "segunda", "inicio": "15:00", "fin": "21:00"}, {"nombre": "tercera", "inicio": "21:00", "fin": "06:00"} ] } ] }'); // io.emit send a message to everione connected
                        io.emit('config', JSON.stringify(json)); // io.emit send a message to everione connected
                    }).catch(function(err) {
                        console.log(err);
                    });
                });
            }
        });

        // When the server receives a “config” type signal from the client 
        // TODO: cambiar esto para que se haga con promesas y con un pool de conexiones
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

        /*
        * Cambio de la planta seleccionada (Paginas que hacen reportes)
        */
        socket.on('cambio-planta', function (message) {
            
            if (message != "all")
            {
                var return_data = {}
                promisePool.getConnection().then(function(connection) {
                    connection.query("select * from turnos where activo = true and plantas_id = " + id).then(function(rows){
                        return_data.turnos = rows
                        
                        var result = connection.query("select * from areas where active = true and plantas_id = " + id)
                        return result
                    }).then(function(rows){
                        return_data.areas = rows
                        
                        var result = connection.query("select * from productos where active = true and plantas_id = " + id)
                        return result
                    }).then(function(rows) {
                        return_data.productos = rows
                        // TODO: Modificar este codigo para enviarselo solo al que lo pidio, estudiar mas el funcionamiento de los sockets
                        io.emit('cambio-planta', return_data); // io.emit send a message to everione connected

                    }).catch(function(err) {
                        console.log(err);
                    });
                });
            }else{
                io.emit('cambio-planta', 'all'); // io.emit send a message to everione connected
            }
        });

        // Aqui puedo ir agregando mas sockets

    });

};

