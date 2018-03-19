exports.emitter = (socket) => {
    socket.send('connected', { message: 'Connection established'});
};