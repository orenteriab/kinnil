const Event = require('../Event').Event;

//Igual, aquí definimos los mensajes de salida
//en este caso es bien interesante, ya que como
//puedes ver, tenemos un "socket.on"; parece que
//socket.io para evitar que los sockets tengan
//todas las funciones, mejor las tienes que
//asignar del lado del servidor, de esa manera
//"evitas" que puedan emitirte mensajes los clientes
//y que te tumben el server.
const outputMessages = {
    connection: new Event('connected', (socket) => {
        //Si te fijas aquí no le respondemos que se conectó.
        //solamente al socket, le asignamos un evento del objeto
        //definido más abajo. Al parecer las cosas las cambiaron
        //y ahora tienes que definir los procesos de entrada por
        //socket-client... eso, o ya tengo mucho que no usaba sockets.
        socket.on(inputMessages.getUsers.name, inputMessages.getUsers.handler(socket));
    }),
    getUsers: new Event('sendUsers', (socket) => {
        return (data) => {
            console.log('I see living data: ', data);
            socket.emit('sendUsers', 'ten');
        };
    })
};


// Aquí solamente están los mensajes de entrada.
// Le dices como se va a comportar el socket y ya está.
const inputMessages = {
    connection: new Event('connection', (socket) => {
        outputMessages.connection.handler(socket);
    }),
    getUsers: new Event('getUsers', outputMessages.getUsers.handler)
};

exports.in = inputMessages;
exports.out = outputMessages;

/** Para probar del lado del cliente:

var usersSocket = io('/users');
usersSocket.on('sendUsers', (data) => {
    console.log(data);
});

usersSocket.emit('getUsers', 'Ay les baila');

*/