let connectionPool = require('../config/database_config').connectionPool;

exports.createAsset = (name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId, up) => {
    let sql = 'INSERT INTO `sandras`.`assets` ';
    sql += '(`id`, ';
    sql += '`name`, ';
    sql += '`type`, ';
    sql += '`plate`, ';
    sql += '`status`, ';
    sql += '`mi`, ';
    sql += '`mi_last_service`, ';
    sql += '`mtto_last`, ';
    sql += '`mtto_next`, ';
    sql += '`notes`, ';
    sql += '`clients_id`, ';
    sql += '`up`) ';
    sql += 'VALUES ';
    sql += '(DEFAULT, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?, ';
    sql += '?); ';

    return connectionPool.query(sql, [name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, 1, up]);
};

exports.findAssetById = (id) => {
    let sql = 'select * from `sandras`.`assets` where `id` = ?';

    return connectionPool.query(sql, [id]);
};

exports.updateAsset = (id, name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId, up) => {
    let sql = 'update ';
    sql += '    `sandras`.`assets` ';
    sql += 'set ';
    sql += '    `name` = ? ';
    sql += '    ,`type`  = ? ';
    sql += '    ,`plate`  = ? ';
    sql += '    ,`status`  = ? ';
    sql += '    ,`mi`  = ? ';
    sql += '    ,`miLastService`  = ? ';
    sql += '    ,`mttoLast`  = ? ';
    sql += '    ,`mttoNext`  = ? ';
    sql += '    ,`notes`  = ? ';
    sql += '    ,`clientsId`  = ? ';
    sql += '    ,`up` = ? ';
    sql += 'where ';
    sql += '    id = ?';

    return connectionPool.query(sql [name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, 1, up, id]);
};

exports.pullPageAsset = (offset, size) => {
    let sql = 'select `id`, `name`, `type`, `plate`, `status`, `mi`, `mi_last_service` from `sandras`.`assets` limit ? offset ?';

    return connectionPool.query(sql, [size, offset]);
};

exports.deleteAsset = (id) => {
    let sql = 'delete from `sandras`.`assets` where `id` = ?'

    return connectionPool.query(sql, [id])
};