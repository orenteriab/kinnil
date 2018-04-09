let dispatcherService = require('../service/dispatcher_service');
const SocketEvent = require('./socket_event').SocketEvent;

const onMessage = (socket) => {
    return new SocketEvent('message', (message) => {
        socket.emit('message', 'alive');
        console.log(`A client is speaking to me! They’re saying: ${message}`);
    });
};

const onAccounts = (socket) => {
    return new SocketEvent('accounts', () => {
        dispatcherService
            .getUsersAndPassword()
            .then((returnData) => {
                socket.emit('accounts', JSON.stringify(returnData));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/accounts/]Error when querying: ', err);
                socket.emit('accounts', 'Error when querying: \n' + err);
            });
    });
};

const onAssets = (socket) => {
    return new SocketEvent('assets', () => {
        dispatcherService
            .getAvailableAssets()
            .then((returnData) => {
                socket.emit('assets', JSON.stringify(returnData));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/assets/]Error when querying: ', err);
                socket.emit('assets', 'Error when querying: \n' + err);
            });
    });
};

const onSelectedAsset = (socket) => {
    return new SocketEvent('selected-asset', (message) => {
        let jsonPayload = JSON.parse(message);
        console.log(jsonPayload)

        dispatcherService
            .selectedAsset(jsonPayload.truck_id, jsonPayload.trailer_id, jsonPayload.id)
            .then(() => {
                socket.emit('selected-asset', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/selected-asset/]Error when querying: ', err);
                socket.emit('selected-asset', JSON.stringify({ resivido: false }));
            });
    });
};

const onActive = (socket) => {
    return new SocketEvent('active', (message) => {
        let jsonPayload = JSON.parse(message);

        dispatcherService
            .active(jsonPayload.id)
            .then(() => {
                // TODO: hay que hacer algo para cuando no se pueda guardar en la DB no mande resivido: true, note que esto pasaba cuando estaba debugeando
                // Ellos esperan que cuando no se guardo el dato en la DB se les mande un resivido: false, la logica de la app de android lo requiere
                socket.emit('active', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/active/]Error when querying: ', err);
                socket.emit('active', JSON.stringify({ resivido: false }));
            });
    });
};

const onInactive = (socket) => {
    return new SocketEvent('inactive', (message) => {
        let jsonPayload = JSON.parse(message);

        dispatcherService
            .inactive(jsonPayload.id)
            .then(() => {
                socket.emit('inactive', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/inactive/]Error when querying: ', err);
                socket.emit('inactive', JSON.stringify({ resivido: false }));
            });
    });
};

const onTms = (socket) => {
    return new SocketEvent('tms', (hrId) => {
        dispatcherService
            .tms(hrId)
            .then((returnData) => {
                // Validamos si vamos a mandar null esto se hace porque el desarrollador de android no puede hacer la comparación si es null o no y le crashea su app :v
                if (JSON.stringify(returnData[0]) == null){
                    socket.emit('tms', '{}');
                } else {
                    socket.emit('tms', JSON.stringify(returnData[0]));
                }
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/tms/]Error when querying: ', err);
                socket.emit('tms', 'Error when querying: ' + err);
            });
    });
};

const onStatus = (socket) => {
    return new SocketEvent('status', (message) => {
        let jsonPayload = JSON.parse(message);
        console.log(jsonPayload)
        dispatcherService //(substatus, latitude, longitude, ticketId, base, silo, weight, bol)
            .addEvent(jsonPayload.substatus, 
                        jsonPayload.latitude, 
                        jsonPayload.longitude, 
                        jsonPayload.id, 
                        jsonPayload.base, 
                        jsonPayload.silo,
                        jsonPayload.weight,
                        jsonPayload.bol)
            .then(() => {
                socket.emit('status', JSON.stringify({ resivido: true }));
            })
            .catch(function (err) {
                console.error('[/app/socket/Events.js][/status/]Error when querying: ', err);
                socket.emit('status', JSON.stringify({ resivido: false }));
            });
    });
};

exports.onConnection = new SocketEvent('connection', (socket) => {

    const socketEvents = [
        onMessage(socket),
        onAccounts(socket),
        onAssets(socket),
        onSelectedAsset(socket),
        onActive(socket),
        onInactive(socket),
        onTms(socket),
        onStatus(socket)
    ];

    socketEvents.forEach((evt) => {
        socket.on(evt.name, evt.handler);
    });

});