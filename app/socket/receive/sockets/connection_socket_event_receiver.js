const ack = require('../../emit/sockets/connection_socket_event_emitter').emitter;

exports.receiver = {
    label: 'connection',
    handle: ack
};