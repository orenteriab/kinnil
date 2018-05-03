let invoiceModel = require('../model/invoice_model')
let Bluebird = require('bluebird');

exports.queryToBeInvoiced = () => {

    return invoiceModel.queryToBeInvoiced()

}

exports.queryToBePaid = () => {

    return invoiceModel.queryToBePaid()

}

exports.queryPaid = () => {

    return invoiceModel.queryPaid()

}

exports.createInvoice = (ticketId) => {
    if(!ticketId || String(ticketId).trim().length == 0){
        return Bluebird.reject('The Load number cannot be null or empty');
    }else{
        return invoiceModel.createInvoice(ticketId);
    }
}