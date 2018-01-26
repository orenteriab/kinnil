/*
* Modelo de eventos
*/

// load up the user model
var moment = require('moment-timezone');
var mysql = require('mysql');
var async = require('async'); // TODO: ver si hay que elimiar async, porque ya no lo estoy utilizando.....
var promiseMysql = require('promise-mysql');
var dbconfig = require('../config/database');

var promisePool = promiseMysql.createPool(dbconfig.connection);
promisePool.query('USE ' + dbconfig.database); // TODO: Esta linea vuelve a confirmar cual es la DB que vamos a utilizar, hay que ver si es necesaria o no

var fs = require('fs')
  , Log = require('log')
  , log = new Log('debug', fs.createWriteStream('./logs/engine.log'));

/*
* Obtiene la informacion del dashboard y se lo manda al ruteador (Inicio y Andon).
*/
exports.getDashboard = function(done) {

    log.info(' getDashboard fucntion called')

    var return_data = {}
    promisePool.getConnection().then(function(connection) {
        
        // TODO: Hay que ver si es factible sacar el codigo de abajo fuera de la conexion para que este mas limpio todo
        var today = new Date();
        var dd = today.getDate();

        console.log(today)
        
        var mm = today.getMonth()+1; 
        var yyyy = today.getFullYear();
        if(dd<10) 
            dd='0'+dd;
        
        if(mm<10) 
            mm='0'+mm;
        
        today = yyyy+'-'+mm+'-'+dd;

        var d = new Date()
        var h = d.getHours()
        var m = d.getMinutes()
        var s = d.getSeconds()
        var horaActual = h + ":" + m + ":" + s
        console.log(horaActual)

        fecha = moment(today + " " + horaActual, 'YYYY-MM-DD HH:mm').tz('America/Chihuahua').format('YYYY-MM-DD')
        hora = moment(today + " " + horaActual, 'YYYY-MM-DD HH:mm').tz('America/Chihuahua').format('HH:mm')
        
        console.log(fecha + " " + hora)

        // TODO: Si no hay turnos, todos los siguientes queries dan undefined. Hay que comprobar que el turno actual es valido antes de hacer todo esto
        // TODO: Hacer algo!!! -> Se muestra la ultima informacion guardada en la DB (activo/inactivo) Pero de eso pudo haber pasado mucho rato si no se ha agregado un cambio nuevo (necesitare agregar algo que verifique el ultimo estatus?????)
        // Turno actual, nos va a servir para obtener la informacion del turno en cuestion
        // TODO: agregar el problema con el turno de tercera, si esta de noche este query no me da resultados (empty set) y no me muestra la pagina
        // TODO: El query tiene que ser contra turnos que esten activos. Activo = true
        //connection.query("SELECT * FROM turnos where CAST(inicio as time) < TIME_FORMAT('" + horaActual + "' as time) and CAST(fin as time) > TIME_FORMAT('" + horaActual + "' as time)").then(function(rows){
        //TODO: hay que revisar la logica y poner alguna advertencia o algo porque si hay 2 turnos que se entralacen en las horas pueden haber problemas
        // TODO: probar este query en el turno de tercera para ver si nos regresa el valor correcto o regresa algo mas
        connection.query("SELECT * \
                        FROM turnos \
                        CROSS JOIN (SELECT CAST('" + hora + "' as time) AS evento) sub \
                        WHERE \
                            CASE WHEN inicio <= fin THEN inicio <= evento AND fin >= evento \
                            ELSE inicio <= evento OR fin >= evento END \
                        AND activo = 1;")
        .then(function(rows){
            return_data.turnoActual = rows
            
            // TODO: A todos estos queries hay que agregar la opcion para que vean el turno de 3ra para que no fallen
            // TA, TM, Disponibillidad Real, Sin disponibilidad Meta. Agrupado por maquina
            // TODO: A todos los queries hay que quitar los enters y \ porque traducidos se ven asi select e.maquinas_id maquina, \t\t\t\tsum(e.valor) piezas, \t\t\t\tsum(e.tiempo) tiempo, \t\t\t\tsum(e.valor)...
            var result = connection.query("select maquinas_id, sum(case when activo=1 then tiempo else 0 end) ta, \
            sum(case when activo=0 then tiempo else 0 end) tm, \
            (sum(case when activo=1 then tiempo else 0 end) * 100) / (sum(case when activo=1 then tiempo else 0 end) + sum(case when activo=0 then tiempo else 0 end)) disponibilidad  \
            from eventos2 e \
            where e.fecha = CAST('" + fecha + "' as date) \
            and e.hora >= CAST('"+ return_data.turnoActual[0].inicio +"' as time) \
            and e.hora < CAST('"+ return_data.turnoActual[0].fin +"' as time) \
            group by maquinas_id") 
            return result
        }).then(function(rows){
            return_data.disponibilidad = rows

            console.log(rows)
            // TODO: Agrer el active = 1 a todos estos queries para evitar informacion inutil
            // Informacion agrupada por maquina (id del eventos2, activo, razon, producto, maquina)
            var result = connection.query("select e.maquinas_id as maquina, m.nombre as nombre, e.id as id, e.activo as activo, r.nombre as razon, p.nombre as producto \
            from (SELECT maquinas_id, max(id) as id \
                FROM eventos2 WHERE activo IS NOT NULL \
                group by maquinas_id) as x \
            inner join eventos2 e on x.id = e.id \
            inner join razones_paro r on r.id = e.razones_paro_id \
            inner join productos p on e.productos_id = p.id \
            inner join maquinas m on e.maquinas_id = m.id") 
                
            return result
        }).then(function(rows){ 
            return_data.estado = rows

            // TODO: A todos estos queries hay que hacerles lo mismo que el query de turnos, porque si no no va a mostrar bien el valor de el turno de 3ra
            // TODO: este query solamente suma 
            // Rendimiento agrupado por maquina
            // TODO TODO: Se queda este query como muestra de lo que se quiere lograr, por mientras se elimina la opcion de que el rendimiento sea sacada del producto para obtener el rendimiento real
            //var result = connection.query("select e.maquinas_id maquina, \
            //sum(e.valor) piezas, \
            //sum(e.tiempo) tiempo, \
            //sum(e.valor)/(sum(e.tiempo)/60/60) 'real', \
            //(sum(e.valor)/(sum(e.tiempo)/60/60))/p.rendimiento rendimiento \
            //from eventos2 e \
            //inner join productos p on e.productos_id = p.id \
            //where e.fecha = CAST('" + fecha + "' as date) \
            //and e.hora >= CAST('"+ return_data.turnoActual[0].inicio +"' as time) \
            //and e.hora < CAST('"+ return_data.turnoActual[0].fin +"' as time) \
            //group by e.maquinas_id") 
            
            var result = connection.query("select maquina, sum(piezas) piezas, sum(tiempo) tiempo, sum(realidad)/count(*) 'real', sum(rendimiento)/count(*) rendimiento from \
            (select e.maquinas_id maquina, p.id, \
            sum(e.valor) piezas, \
            sum(e.tiempo) tiempo, \
            sum(e.valor)/(sum(e.tiempo)/60/60) realidad, \
            (sum(e.valor)/(sum(e.tiempo)/60/60))/p.rendimiento rendimiento \
            from eventos2 e \
            inner join productos p on e.productos_id = p.id \
            where e.fecha = CAST('" + fecha + "' as date) \
            AND e.hora >= CAST('"+ return_data.turnoActual[0].inicio +"' as time) AND e.hora < CAST('"+ return_data.turnoActual[0].fin +"' as time) \
            group by p.id, e.maquinas_id) sub \
            group by maquina") 
            return result
        }).then(function(rows){ 
            return_data.rendimiento = rows

            // Calidad agrupada por maquina
            /*var result = connection.query("select e.maquinas_id, \
            sum(case when e.razones_calidad_id = 1 then e.valor else 0 end) pt, \
            sum(case when e.razones_calidad_id > 1 then e.valor else 0 end) scrap, \
            sum(e.valor) total, \
            sum(case when e.razones_calidad_id = 1 then e.valor else 0 end) * 100 / sum(e.valor) calidad_real, \
            sum(case when e.razones_calidad_id = 1 then e.valor else 0 end) * 100 / sum(e.valor) / p.calidad calidad \
            from eventos2 e \
            inner join productos p on e.productos_id = p.id \
            where e.fecha = CAST('" + fecha + "' as date) \
            and e.hora >= CAST('"+ return_data.turnoActual[0].inicio +"' as time) \
            and e.hora < CAST('"+ return_data.turnoActual[0].fin +"' as time) \
            group by e.maquinas_id;") */

            var result = connection.query("select maquina, sum(pt) pt, sum(scrap) scrap, sum(total) total, sum(calidad_real)/count(*) calidad_real, sum(calidad)/count(*) calidad from \
            (select e.maquinas_id maquina, \
            sum(case when e.razones_calidad_id = 1 then e.valor else 0 end) pt, \
            sum(case when e.razones_calidad_id > 1 then e.valor else 0 end) scrap, \
            sum(e.valor) total, \
            sum(case when e.razones_calidad_id = 1 then e.valor else 0 end) * 100 / sum(e.valor) calidad_real, \
            sum(case when e.razones_calidad_id = 1 then e.valor else 0 end) * 100 / sum(e.valor) / p.calidad calidad \
            from eventos2 e \
            inner join productos p on e.productos_id = p.id \
            where e.fecha = CAST('" + fecha + "' as date) \
            and e.hora >= CAST('"+ return_data.turnoActual[0].inicio +"' as time) \
            and e.hora < CAST('"+ return_data.turnoActual[0].fin +"' as time) \
            group by p.calidad, e.maquinas_id) sub \
            group by maquina")
            
            return result
        }).then(function(rows) {
            return_data.calidad = rows

            // Suelta la conexion ejemplo: Connection 404 released
            //connection.release();
            // Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
            promisePool.releaseConnection(connection);

            console.log(return_data)
            return done(null, return_data); // Regresa la informacion solicitada
            
        }).catch(function(err) {
            console.log(err);
            return done(err) // Regresa un error
        });
    });
}

/*
* Obtiene la informacion necesaria para cargar los reportes y se lo manda al ruteador (disponibilidad, rendimiento, calidad y modificar calidad).
*/
exports.getReportesInfo = function(done) {
    var return_data = {}
    // TODO: Aqui hay algo raro parece que no me esta regresando la informacion bien por que en la pagina no me aparece bien, checar
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
            
            var result = connection.query("select * from maquinas where active = true")
            return result
        }).then(function(rows){
            return_data.maquinas = rows
            
            // Suelta la conexion ejemplo: Connection 404 released
            //connection.release();
            // Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
            promisePool.releaseConnection(connection);

            // Se separan los datos obtenidos de los queries.
            var plantas = return_data.plantas
            var areas = return_data.areas
            var turnos = return_data.turnos
            var productos = return_data.productos
            var maquinas = return_data.maquinas


            // TODO: ver si se puede utilizar una de estas formas para hacer mas rapido este pedo y delegar las operaciones a otro modulo
            /*https://github.com/kyleladd/node-mysql-nesting
            http://bender.io/2013/09/22/returning-hierarchical-data-in-a-single-sql-query/
            http://blog.tcs.de/creating-trees-from-sql-queries-in-javascript/*/

            // Objeto donde se va a guardar toda la confirguacion.
            var json = {plantas : []}

            // TODO: Hay que poner un ejemplo de como es regresada esta informacion por que al ultimo uno no se acuerda como es
            // Arma un json con las plantas las areas productos y turnos para mandarlo a la pagina.
            // TODO: hay que checar esta funcion porque ya me dio un error TypeError: Cannot read property 'plantas_id' of undefinedat c:\projects\kinnil\app\routes.js:158:19
            for (var x = 0; x<plantas.length; x++){
                planta = plantas[x]
                json.plantas.push({"id": planta.id, "nombre": planta.nombre, "areas": [], "turnos": [], "productos": []}) // Se agrega un objeto con el nombre de cada planta y area (2do nivel)

                for (var y = 0; y<areas.length; y++){ // Se recorren todas las areas
                    area = areas[y]

                    if (area.plantas_id == planta.id){ // Si el area le pertenece a la planta en turno
                        json.plantas[x].areas.push({"id": area.id, "nombre":area.nombre, maquinas: []}) // Se agrega el area a la planta en turno (3er nivel)

                        for (var z = 0; z<maquinas.length; z++){ // Se recorren todas las maquinas
                            maquina = maquinas[z]
    
                            if (maquina.areas_id == area.id){ // Si el maquina le pertenece a la planta en turno
                                json.plantas[x].areas[y].maquinas.push({"id": maquina.id, "nombre":maquina.nombre}) // Se agrega el area a la planta en turno (3er nivel)
                            }
                        }

                    }
                }
                for (var b = 0; b<turnos.length; b++){
                    turno = turnos[b]

                    if (turno.plantas_id == planta.id){
                        json.plantas[x].turnos.push({"id": turno.id, "nombre": turno.nombre})
                    }
                }
                for (var c = 0; c<productos.length; c++){
                    producto = productos[c]

                    if (producto.plantas_id == planta.id){
                        json.plantas[x].productos.push({"id": producto.id, "nombre": producto.nombre})
                    }
                }
            }

            console.log(JSON.stringify(json))

            return done(null, return_data, json)
            
        }).catch(function(err) {
            console.log(err);
            return done(err)
        });
    });
}

/*
* TODO: unificar getModificarCalidad y getReportesInfo (son muy parecidos y tendrian que estar juntos) - codigo + facil de mantener!
*/
exports.getModificarCalidad = function(done) {
    var return_data = {}
    promisePool.getConnection().then(function(connection) {
        // Primero obtiene el turno actual
        // TODO: Quitar el query al turno porque aqui no es necesario
        connection.query("select * from turnos where activo = true").then(function(rows){
            return_data.turnos = rows
            
            var result = connection.query("select * from maquinas where active = true")
            return result
        }).then(function(rows){
            return_data.maquinas = rows
            
            var result = connection.query("select * from plantas where active = true")
            return result
        }).then(function(rows){
            return_data.plantas = rows
            
            var result = connection.query("select * from areas where active = true")
            return result
        }).then(function(rows){
            return_data.areas = rows
            
            // where id < 1 porque el primer registro de la DB es pieza buena (para efectos de mejorar y hacer mas sencillos los queries)
            var result = connection.query("select * from razones_calidad where activo = true and id > 1")
            return result
        }).then(function(rows){
            return_data.razones_calidad = rows

            // Suelta la conexion ejemplo: Connection 404 released
            //connection.release();
            // Parece que funciona igual al de arriba. Hay que probarlo en desarrollo
            promisePool.releaseConnection(connection);
            
            // Se separan los datos obtenidos de los queries.
            var plantas = return_data.plantas
            var areas = return_data.areas
            var turnos = return_data.turnos
            var maquinas = return_data.maquinas


            // TODO: ver si se puede utilizar una de estas formas para hacer mas rapido este pedo y delegar las operaciones a otro modulo
            /*https://github.com/kyleladd/node-mysql-nesting
            http://bender.io/2013/09/22/returning-hierarchical-data-in-a-single-sql-query/
            http://blog.tcs.de/creating-trees-from-sql-queries-in-javascript/*/

            // Objeto donde se va a guardar toda la confirguacion.
            var json = {plantas : []}

            // TODO: Hay que agregar las razones de calidad, no se si sea por maquina por planta

            // Arma un json con las plantas las areas productos y turnos para mandarlo a la pagina.
            for (var x = 0; x<plantas.length; x++){
                planta = plantas[x]
                json.plantas.push({ "id": planta.id, "nombre": planta.nombre, "areas": [], "turnos": [] }) // Se agrega un objeto con el nombre de cada planta y area (2do nivel)

                for (var y = 0; y<areas.length; y++){ // Se recorren todas las areas
                    area = areas[y]

                    if (area.plantas_id == planta.id){ // Si el area le pertenece a la planta en turno
                        json.plantas[x].areas.push({"id": area.id, "nombre":area.nombre, maquinas: []}) // Se agrega el area a la planta en turno (3er nivel)

                        for (var z = 0; z<maquinas.length; z++){ // Se recorren todas las maquinas
                            maquina = maquinas[z]
    
                            if (maquina.areas_id == area.id){ // Si el maquina le pertenece a la planta en turno
                                json.plantas[x].areas[y].maquinas.push({"id": maquina.id, "nombre":maquina.nombre}) // Se agrega el area a la planta en turno (3er nivel)
                            }
                        }

                    }
                }
                for (var b = 0; b<turnos.length; b++){
                    turno = turnos[b]

                    if (turno.plantas_id == planta.id){
                        json.plantas[x].turnos.push({"id": turno.id, "nombre": turno.nombre})
                    }
                }
            }

            console.log(JSON.stringify(json))
            
            return done(null, return_data, json)
            
        }).catch(function(err) {
            console.log(err)
            return done(err)
        });
    });
}

/*
* Ontiene la configuracion y la manda al ruteador
*/
exports.getConfiguracion = function(done) {
    var return_data = {}
    promisePool.getConnection().then(function(connection) {

        connection.query("SELECT * FROM plantas WHERE active = true").then(function(rows){
            return_data.plantas = rows
            
            var result = connection.query("SELECT a.id 'id', a.nombre 'nombre', a.notas 'notas', p.id 'p_id', p.nombre 'planta' FROM areas a INNER JOIN plantas p ON a.plantas_id = p.id and a.active=true") 
            return result
        }).then(function(rows){
            return_data.areas = rows

            var result = connection.query("SELECT m.id 'id', m.nombre 'nombre', m.notas 'notas', a.nombre 'area', p.id 'productos_id', p.nombre 'producto' FROM maquinas m INNER JOIN areas a ON m.areas_id = a.id INNER JOIN productos p ON m.productos_id = p.id WHERE m.active = true") 
                
            return result
        }).then(function(rows){ 
            return_data.maquinas = rows
            
            var result = connection.query("SELECT r.id 'id', r.nombre 'nombre', m.nombre 'maquina' FROM razones_paro r INNER JOIN maquinas m ON r.maquinas_id = m.id WHERE r.active = true") 
            return result
        }).then(function(rows){ 
            return_data.razones = rows

            var result = connection.query("SELECT r.id 'id', r.nombre 'nombre', m.nombre 'maquina' FROM razones_calidad r INNER JOIN maquinas m ON r.maquinas_id = m.id WHERE r.activo = true")
            
            return result
        }).then(function(rows){ 
            return_data.calidad = rows

            var result = connection.query("SELECT * FROM productos where activo = 1")
            
            return result
        }).then(function(rows){ 
            return_data.productos = rows

            var result = connection.query("SELECT t.id 'id', t.nombre 'nombre', t.inicio 'inicio', t.fin 'fin', p.nombre 'planta' FROM turnos t INNER JOIN plantas p ON t.plantas_id = p.id WHERE t.activo = true")
            
            return result
        }).then(function(rows){ 
            return_data.turnos = rows

            var result = connection.query("SELECT * FROM users")

            return result
        }).then(function(rows) {
            return_data.users = rows

            promisePool.releaseConnection(connection)

            console.log(return_data)
            return done(null, return_data)
            
        }).catch(function(err) {
            console.log(err)
            return done(err)
        });
    });
}

exports.modificarNombrePlanta = function(pk, valor, done) {

    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE plantas SET nombre ="' + valor + '" where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.modificarNombreArea = function(pk, valor, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE areas SET nombre ="' + valor + '" where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.modificarNombreMaquina = function(pk, valor, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE maquinas SET nombre ="' + valor + '" where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.modificarProductoMaquina = function(pk, valor, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE maquinas SET productos_id ="' + valor + '" where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.deletePlanta = function(pk, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE plantas SET active = 0 where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.deleteArea = function(pk, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE areas SET active = 0 where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.deleteMaquina = function(pk, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE maquinas SET active = 0 where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.deleteProducto = function(pk, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE productos SET activo = 0 where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.deleteRazonDeParo = function(pk, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE razones_paro SET active = 0 where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

exports.deleteTurno = function(pk, done) {
    
    promisePool.getConnection().then(function(connection) {
        connection.query('UPDATE turnos SET activo = 0 where id = ' + pk).then(function(rows){
                promisePool.releaseConnection(connection);
        }).then(function(rows) {
            return done(null, true);

        }).catch(function(err) {
            console.log(err); 
            return done(err)

        });
    });
}

// TODO: el siguiente codigo no funciona.
exports.postConfiguracion = function(tipo, done) {
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
}

exports.otro = function(valor, done) {
    // cuando termine llama return done(null, return_data); o return done(err)
}
