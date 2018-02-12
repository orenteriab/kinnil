import * as userModel from '../model/user_model';
import {hashSync, compareSync} from 'bcrypt-nodejs';
import { passport } from '../config/passport_config';

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
                passportDone(null, false, passportRequest.flash('signupMessage', 'That username is already taken.'));
            }else{
                let cryptedPassword = hashSync(password, null);
                let userToCreate = {
                    username: username,
                    password: cryptedPassword
                };

                userModel
                    .createUser(username, cryptedPassword)
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
                passportDone(null, false, passportRequest.flash('loginMessage', 'Invalid user and/or password.'));
            }else if(!compareSync(password, rows[0].password)){
                passportDone(null, false, passportRequest.flash('loginMessage', 'Invalid user and/or password.'));
            }else{
                passportDone(null, rows[0]);
            }
        });
};

exports.createUser = (username, password) => {
    return userModel
        .createUser(username, hashSync(password, null));
};

exports.updateUser = (userId, username, password) => {
    return userModel
        .updateUser(userId, username, hashSync(password, null));
};

exports.deleteuser = (userId) => {
    return userModel
        .deleteUser(userId);
};