let isNumber = require('util').isNumber;
let model = require('../model/assets_model')

exports.create = (name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId, up) => {
    return model.createAsset(name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId, up);
}

exports.update = (id, name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId, up) => {
    return model.updateAsset(id, name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId, up)
}

exports.findById = (id) => {
    return model.findAssetById(id);
}

exports.deleteAsset = (id) => {
    return model.deleteAsset(id);
};

exports.pullPageAsset = (page, size) => {
    if(!page || !isNumber(page)) page = 1;
    if(!size || !isNumber(size)) size = 100;
    let offset = (page - 1) * size;

    return model.pullPageAsset(offset, size);
} 