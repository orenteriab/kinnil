let model = require('../model/reports_model')

exports.getCompletedLoadsReport = (inicio, fin) => {
    return model.getCompletedLoadsReport(inicio, fin)
}

exports.getQuickbooksReport = (inicio, fin, locationName) => {
    return model.getQuickbooksReport(inicio, fin, locationName)
}

exports.getDiamonBackReport = async(start, end) => {
    try{
        let drivers = await model.getDiamonbackDriversForReport(start, end)

        let driverPromises = drivers.map((driver) => {
            return model.getDiamonbackReportRecord(start, end, driver);
        })

        return Promise.all(driverPromises)
    }catch(e){
        return Promise.reject(e);
    }
}