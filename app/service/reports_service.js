let model = require('../model/reports_model')

exports.getCompletedLoadsReport = (inicio, fin) => {
    return model.getCompletedLoadsReport(inicio, fin)
}
