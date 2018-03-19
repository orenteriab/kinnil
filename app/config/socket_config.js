const SOCKET_BROKER = require('socket.io');
const SOCKETS_CONNECT_EVENT_RECEIVER = require('../socket/receive/sockets/connection_socket_event_receiver').receiver;

exports.init = (server) => {
    const IO = SOCKET_BROKER(server);

    /**********************************************************
     ****************Explicación de los sockets****************
     **********************************************************
    Estos son para sockets genéricos
    podemos dividirlos entre "canales", 
    el canal por defecto estará en /sockets
    por eso la carpeta en /app/socket tiene 
    dos directorios:
      emit: Que en ese directorio van a vivir 
            todas las señales que enviaremos
      receive: Que en ese directorio van a 
               vivir todas las señales que 
               recibiremos, además los 
               emitters solo serían llamados 
               desde un receiver. De esa 
               manera, tendremos una cadenita:
                  mensaje_del_cliente -> 
                      socket_receiver -> 
                          socket_emitter -> 
                              service -> 
                                  model
    Dentro de esos directorios de receive y 
    emit tenemos un directorio que se llama
    "sockets", ese es el nombre del "canal"
    por canal crearemos un directorio para 
    tenerlo todo bien organizado.
    Aquí nomas vamos a poner cuales receivers van a existir.
    **********************************************************
    ****************Explicación de los sockets****************
    **********************************************************/
    IO.of('/sockets')
        .on(SOCKETS_CONNECT_EVENT_RECEIVER.label, SOCKETS_CONNECT_EVENT_RECEIVER.handle);

    /*
    Para abrir otro canal podríamos tener:
    IO.of('/drivers')
        .on(SOCKETS_DRIVER_CANCEL_TRIP.label, SOCKETS_DRIVER_CANCEL_TRIP.handle);
    
    Solo es un ejemplo. Y pues en 
    app/socket/emit y app/socket/receive 
    tendríamos otro directorio "drivers"
    */
};