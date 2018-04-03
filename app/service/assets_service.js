let model = require('../model/assets_model')

exports.create = (name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId) => {
    return model.createAsset(name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId);
}

exports.update = (id, name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId) => {
    return model.updateAsset(id, name, type, plate, status, mi, miLastService, mttoLast, mttoNext, notes, clientsId)
}

exports.findById = (id) => {
    return model.findAssetById(id);
}