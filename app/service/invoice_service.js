let invoiceModel = require('../model/invoice_model')

exports.queryToBeInvoiced = () => {

    return invoiceModel.queryToBeInvoiced()

}

exports.queryToBePaid = () => {

    return invoiceModel.queryToBePaid()

}

exports.queryPaid = () => {

    return invoiceModel.queryPaid()

}