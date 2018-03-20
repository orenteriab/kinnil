exports.emitter = (socket) => {
    socket.emit('connected', { message: 'Connection established'});
};