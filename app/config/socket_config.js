const SOCKET_BROKER = require('socket.io');
const defaultSocketEvents = require('../socket/events/default/events');
const userSocketEvents = require('../socket/events/users/events');
const dispatcherSocketEvents = require('../socket/events/dispatcher/events');


let dispatcherService = require('../service/dispatcher_service');



exports.init = (server) => {
    const IO = SOCKET_BROKER(server);

     /**********************************************************
     ****************Explicación de los sockets****************
     **********************************************************
    Aquí se declaran los sockets, y las conexiones que se harán
    a los módulos de los sockets, en este caso, tenemos /sockets
    y /users
    **********************************************************
    ****************Explicación de los sockets****************
    **********************************************************/

    //Aquí declaramos el módulo "sockets", en donde irán los sockets
    //genéricos, ahorita no hay, entonces, un mensaje simple de
    //conexión existosa y ya. Abre el archivo kinnil/app/socket/events/default/events.js
    //para ver que sigue.

    IO.sockets.on('connection', function (socket) {
        console.log('A client is connected!');
        socket.emit('message', 'alive');
        socket.emit('conectado', 'se conecto una tablet')
        
        socket.on('message', function (message) {
            socket.emit('message', 'alive');
            console.log('A client is speaking to me! They’re saying: ' + message);
        });

        socket.on('accounts', (message) => {
            dispatcherService
                .getUsersAndPassword()
                .then((return_data) => {
                    socket.emit('accounts', JSON.stringify(return_data));
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/]Error when querying: ', err);
                    socket.emit('accounts', 'Error when querying: \n' + err);
                });
        })

        socket.on('assets', (message) => {
            dispatcherService
                .getAvailableAssets()
                .then((return_data) => {
                    socket.emit('assets', JSON.stringify(return_data));
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/assets/]Error when querying: ', err);
                    socket.emit('assets', 'Error when querying: \n' + err);
                });
        })

        socket.on('selected-asset', (message) => {
            
            message = JSON.parse(message)
            dispatcherService
                .selectedAsset(message.truck, message.trailer, message.id)
                .then(() => {
                    socket.emit('selected-asset', '{"resivido": true}'); //Todo hay que mandarlo como string, asi lo necesita El que desarrolla la app de Android
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/selected-asset/]Error when querying: ', err);
                    socket.emit('selected-asset', '{"resivido": false}');
                });
        })

        socket.on('active', (message) => {
            
            message = JSON.parse(message)
            dispatcherService
                .active(message.id)
                .then(() => {
                    // TODO: hay que hacer algo para cuando no se pueda guardar en la DB no mande resivido: true, note que esto pasaba cuando estaba debugeando
                    // Ellos esperan que cuando no se guardo el dato en la DB se les mande un resivido: false, la logica de la app de android lo requiere
                    socket.emit('active', '{"resivido": true}');
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/active/]Error when querying: ', err);
                    socket.emit('active', '{"resivido": false}');
                });
        })
        
        socket.on('inactive', (message) => {
            
            message = JSON.parse(message)
            dispatcherService
                .inactive(message.id)
                .then(() => {
                    socket.emit('inactive', '{"resivido": true}');
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/inactive/]Error when querying: ', err);
                    socket.emit('inactive', '{"resivido": false}');
                });
        })

        socket.on('tms', (hrId) => {
            
            dispatcherService
                .tms(hrId)
                .then((return_data) => {
                    socket.emit('tms', JSON.stringify(return_data));
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/tms/]Error when querying: ', err);
                    socket.emit('tms', 'Error when querying: ' + err);
                });
        })

        socket.on('status', (message) => {
            
            message = JSON.parse(message)
            dispatcherService
                .addEvent(message)
                .then((return_data) => {
                    socket.emit('status', '{"resivido": true}');
                })
                .catch(function (err) {
                    console.error('[socket_config.js][/status/]Error when querying: ', err);
                    socket.emit('status', '{"resivido": false}');
                });
        })

        

        // Aqui puedo ir agregando mas sockets
    });

    
 
    IO.of('/sockets').on(defaultSocketEvents.in.connection.name, defaultSocketEvents.in.connection.handler);

    //Aquí declaramos el módulo "users", en donde irán los sockets
    //referentes a los eventos de usuario. De momento crearemos un
    //evento de getUser que solo responderá "{message: 'Alive!'}".
    //Abre el archivo kinnil/app/socket/events/users/events.js
    //para ver que sigue.
    IO.of('/users').on(userSocketEvents.in.connection.name, userSocketEvents.in.connection.handler);

    /*
    Para abrir otro canal podríamos tener:
    IO.of('/drivers')
        .on(SOCKETS_DRIVER_CANCEL_TRIP.label, SOCKETS_DRIVER_CANCEL_TRIP.handle);
    
    Solo es un ejemplo. Y pues en 
    app/socket/emit y app/socket/receive 
    tendríamos otro directorio "drivers"
    */
    // Modulo para los sockets del dispatcher... Casi creo que van a ser los unicos sockets que utilicemos, probablmente necesitemos otro modulo para el mtto
    IO.of('/dispatcher').on(dispatcherSocketEvents.in.connection.name, dispatcherSocketEvents.in.connection.handler);

};