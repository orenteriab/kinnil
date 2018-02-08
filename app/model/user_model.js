import {connectionPool} from '../config/database_config';

exports.findUserById = (userId) => {
  let statement =  'select * from `users` `u` where `u`.`id` = ?';

  return connectionPool.query(statement, [userId]);
};

exports.findUserByUserName = (username) => {
  let statement =  'select * from `users` `u` where `u`.`username` = ?';

  return connectionPool.query(statement, [username]);
};

exports.createUser = (username, password) => {
  let statement = 'insert into `users`(`username`, `password`) values (?, ?)';

  return connectionPool.query(statement, [username, password]);
};

exports.findUsers = (size, page) => {
  let defSize = size !== null && 
    size !== undefined && 
    typeof size === 'number' ? size : 10;

  let defPage = page !== null && 
    page !== undefined && 
    typeof package === 'number' ? page : 1;

  let offset = (defPage - 1) * defSize;

  let statement = 'select * from `users` `u` limit ?, ?';

  return connectionPool.query(statement, [offset, defSize]);
};