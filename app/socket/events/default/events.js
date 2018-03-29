const Event = require('../Event').Event;

//En este caso creamos el objeto de mensajes
//de salida. En este caso, definimos un evento
//'connected', que será emitido y su response
//un '{ "message": "Connected successfully!" }';
//y eso es todo.
const outputMessages = {
    connection: new Event('connected', (socket) => {
        socket.emit('connected', { message: 'Connected successfully!' });
    })
};


//Aquí, creamos el objeto de los mensajes de
//entrada. En este caso, definimos el de 'connection'.
//Ese evento es muy importante, en este caso, no se
//aprecia. Pero, pues igual, lo que hace es que 
//manda a llamar a la función handler del evento 
//definido arriba. Y le pasa el socket, por cualquier
//cosa, en este caso, para decirle al socket que
//sí se pudo conectar.
const inputMessages = {
    connection: new Event('connection', (socket) => {
        outputMessages.connection.handler(socket);
    })
};

//exportamos los mensajes de entrada, que son los únicos
//que necesitamos en la configuración.
exports.in = inputMessages;

/**
 * Para probar del lado del cliente:

var defaultSocket = io('/sockets');
defaultSocket.on('connected', (data) => {
    console.log(data);
});
 */