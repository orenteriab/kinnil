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
        return Bluebird.reject('The ticket id cannot be null or empty')
    }else{
        return invoiceModel.createInvoice(ticketId)
    }
}

exports.updatePayment = (invoiceId, paymentId) => {
    if(!paymentId || String(paymentId).trim().length == 0){
        return Bluebird.reject('The payment id cannot be null or empty')
    }else{
        return invoiceModel.updatePayment(invoiceId, paymentId)
    }
}

exports.viewInvoice = (invoiceId) => {
    if(!invoiceId || String(invoiceId).trim().length == 0){
        return Bluebird.reject('The invoice id cannot be null or empty')
    }else{
        return invoiceModel.viewInvoice(invoiceId)
    }
};

exports.updatePrinted = (invoiceId) => {
    if(!invoiceId || String(invoiceId).trim().length == 0){
        return Bluebird.reject('The invoice id cannot be null or empty')
    }else{
        return invoiceModel.updatePrinted(invoiceId)
    }
}