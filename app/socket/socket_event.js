exports.SocketEvent = function(name, handler) {
    this.name = name;
    this.handler = handler;

    return this;
};