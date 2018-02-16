let Router = require('express').Router;
let userService = require('../../service/user_service');

const ROUTER = Router();

ROUTER.post('/', (req, res) => {
    userService
        .createUser(req.body.username, req.body.password)
        .then(() => {
            res.status(201);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'User created.' }));
        })
        .catch((err) => {
            console.error('[user_controller.js][/]Error when creating user: ', err);

            res.status(400);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'User couldn\'t be created. Check username and password.' }));
        });
});

ROUTER.put('/:id', (req, res) => {
    const userId = req.params.id;

    userService
        .updateUser(userId, req.body.username, req.body.password)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'User has been updated successfully.' }));
        })
        .catch((err) => {
            console.error('[user_controller.js][/' + userId + ']Error when updating user: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'User couldn\'t be updated. Please retry.' }));
        });
});

ROUTER.get('/:id', (req, res) => {
    const userId = req.params.id;

    userService.findUserById(req.params.id)
        .then((rows) => {
            res.contentType('application/json');

            if(rows.length === undefined || 
                rows.length === null ||
                rows.length === 0){
                res.status(404);
                res.contentType('application/json');
                res.send(JSON.stringify({ message: 'User not found.' }));
            }else{
                res.status(200);
                res.contentType('application/json');
                res.send(JSON.stringify({ message: 'User found', payload: rows }));
            }
        })
        .catch((err) => {
            console.error('[user_controller.js][/' + userId + ']Error when pulling user: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Unable to lookup user. Try again later, please.' }));
        });
});

ROUTER.delete('/:id', (req, res) => {
    const userId = req.params.id;

    userService.deleteuser(userId)
        .then(() => {
            res.status(200);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'User deleted.' }));
        })
        .catch((err) => {
            console.error('[user_controller.js][/' + userId + ']Error when deleting user: ', err);

            res.status(500);
            res.contentType('application/json');
            res.send(JSON.stringify({ message: 'Unable to delete user. Try again later, please.' }));
        });
});

exports.router = ROUTER;