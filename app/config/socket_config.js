const SOCKET_BROKER = require('socket.io');

function SocketEventEmitter(label, payload){
    this.label = label;
    this.payload = payload;

    return this;
}

function SocketEventReceiver(label, socket, handler){
    this.label = label;
    this.handler = handler;
    this.socket = socket;

    return this;
}

function isDataEmpty(data){
    return data === undefined || data === null || String(data).trim().length == 0;
}

const EVENTS = {
    emitted: {
        connection: new SocketEventEmitter('connection', { message: 'Connection established.'}),
        invalidData: new SocketEventEmitter('invalid_data', { message: 'The data you sent is not formatted and/or valid.' }),

    },
    received: {
        updateLocation: (socket) => {
            return new SocketEventReceiver('update_location', socket, (data) => {
                if(isDataEmpty(data)){
                    let eventToEmit = new SocketEventEmitter(
                        'invalid_update_location_data', 
                        { message: 'The data you sent to update location is not valid.' }
                    );

                    socket.emit(eventToEmit.label, eventToEmit.payload);
                }else{
                    socket.emit();
                }
            });
        }
    }
};

exports.init = (server) => {
    const IO = SOCKET_BROKER(server);

    IO
        .of('/socket')
        .on('connection', (socket) => {
            socket.emit(EVENTS.emitted.connection.label, EVENTS.emitted.connection.payload);

            const partialUpdateLocationEmitter = EVENTS.received.updateLocation(socket);
            socket.on(partialUpdateLocationEmitter.label, partialUpdateLocationEmitter.handler);

        });
};