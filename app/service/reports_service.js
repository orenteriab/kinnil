let model = require('../model/reports_model')

exports.getCompletedLoadsReport = (inicio, fin) => {
    return model.getCompletedLoadsReport(inicio, fin)
}

exports.getQuickbooksReport = (inicio, fin, locationName) => {
    return model.getQuickbooksReport(inicio, fin, locationName)
}