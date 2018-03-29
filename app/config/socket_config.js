const SOCKET_BROKER = require('socket.io');
const defaultSocketEvents = require('../socket/events/default/events');
const userSocketEvents = require('../socket/events/users/events');

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
};