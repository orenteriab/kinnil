let userModel = require('../model/user_model');
let bcrypt = require('bcrypt-nodejs');

function passportUserSignUpThenHandler(passportDone, createdUser){
    return (rows) => {
        createdUser.id = rows.insertId;
        passportDone(null, createdUser);
    };
}

exports.loginForm = (req, res) => {
    let flashMessage = req.flash('loginMessage') || '';
    let templateObject = {
        message: flashMessage
    };

    res.render('pages/login.ejs', templateObject);
};

exports.findUserById = (userId) => {
    return userModel.findUserById(userId);
};

exports.passportUserSignUp = (passportRequest, username, password, passportDone) => {
    userModel
        .findUserByUserName(username)
        .then((rows) => {
            if(rows.length !== undefined && 
              rows.length !== null &&
              typeof rows.length === 'number' &&
              rows.length > 0){
                passportDone(null, false, passportRequest.flash('message', 'That username is already taken.'));
            }else{
                let cryptedPassword = bcrypt.hashSync(password, null);
                let userToCreate = {
                    username: username,
                    password: cryptedPassword
                };

                userModel
                    .createUser(username, cryptedPassword, passportRequest.body.role, passportRequest.body.email)
                    .then(passportUserSignUpThenHandler(passportDone, userToCreate))
                    .catch((err) => passportDone(err));
            }
        });
};

exports.passportUserLogin = (passportRequest, username, password, passportDone) => {
    userModel
        .findUserByUserName(username)
        .then((rows) => {
            if(rows.length === undefined || 
                rows.length === null ||
                typeof rows.length !== 'number' ||
                rows.length < 1){
                passportDone(null, false, passportRequest.flash('message', 'Invalid user and/or password.'));
            }else if(!bcrypt.compareSync(password, rows[0].password)){
                passportDone(null, false, passportRequest.flash('message', 'Invalid user and/or password.'));
            }else{
                passportDone(null, rows[0]);
            }
        });
};

exports.createUser = (username, password) => {
    return userModel
        .createUser(username, bcrypt.hashSync(password, null));
};

exports.updateUser = (userId, username, password) => {
    return userModel
        .updateUser(userId, username, bcrypt.hashSync(password, null));
};

exports.deleteuser = (userId) => {
    return userModel
        .deleteUser(userId);
};