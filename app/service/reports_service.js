let model = require('../model/reports_model')
let dateUtils = require('../helpers/date')

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

exports.getPayrollHrReport = async(start, end, position) => {
    try{
        return await model.getHrForReportAsync(position, start, end)
    }catch(e){
        return Promise.reject(e);
    }
 }

 exports.CEOReport = () => {

    var currentDate = dateUtils.getCurrentDateAndTime()

    let totalLoads = model.totalLoads(currentDate)
    let totalVolume = model.totalVolume(currentDate)
    let loadsPerClient = model.loadsPerClient(currentDate)
    let sandsPerClient = model.sandsPerClient(currentDate)
    let totalSandPerClient = model.totalSandPerClient(currentDate)
    let clientsList = model.clientsList()

    // Esperamos a que todas las promesas se cumplan para enviar la promesa final
    var return_data = {};
    return Promise.all([totalLoads,totalVolume,loadsPerClient,sandsPerClient,totalSandPerClient,clientsList]).then((data) => {
        
        return_data.totalLoads = data[0];
        return_data.totalVolume = data[1];
        return_data.loadsPerClient = data[2];
        return_data.sandsPerClient = data[3];
        return_data.totalSandPerClient = data[4];
        return_data.clientsList = data[5];

        return return_data;
    });
 }