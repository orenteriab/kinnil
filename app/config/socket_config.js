const SOCKET_BROKER = require('socket.io');
const DISPATCHER_EVENTS = require('../socket/dispatcher_events').onConnection;

//Sugerencia: Utilicemos en los mensajes de cada manejador de eventos
//nombres que los diferencíen. Por ejemplo:
//socket.on('/dispatcher/message', ...);
//Así nos aseguramos que solo en dispatcher_events va a existir el 
//mensaje "/dispatcher/message" va a existir la respuesta a ese evento
//y que de ahí, nadie más lo va a tomar.
// Ya que por ejemplo, ahorita, el evento "message" nadie más lo va a
// poder usar o se va a escuchar "de más".
exports.init = (server) => {
    const IO = SOCKET_BROKER(server);
    IO.on(DISPATCHER_EVENTS.name, DISPATCHER_EVENTS.handler);
};