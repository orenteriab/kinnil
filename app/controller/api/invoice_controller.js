let Router = require('express').Router;
let invoiceService = require('../../service/invoice_service');
let ticketService = require('../../service/tickets_service')

const ROUTER = Router();

ROUTER.get('/toBeInvoiced', (req, res) => {
    invoiceService
        .queryToBeInvoiced()
        .then(
            (toInvoice) => {
                res.status(200)
                res.json(toInvoice)
            },
            (err) => {
                console.error(err)

                res.status(500)
                res.json({ error: 'Unable to pull tickets to be invoiced. Try again later.'})
            })
})

ROUTER.get('/toBePaid', (req, res) => {
    invoiceService
        .queryToBePaid()
        .then(
            (toPay) => {
                res.status(200)
                res.json(toPay)
            },
            (err) => {
                console.error(err)

                res.status(500)
                res.json({ error: 'Unable to pull invoices to be paid. Try again later.'})
            }
        )
})

ROUTER.get('/paid', (req, res) => {
    invoiceService
        .queryPaid()
        .then(
            (paid) => {
                res.status(200)
                res.json(paid)
            },
            (err) => {
                console.error(err)

                res.status(500)
                res.json({ error: 'Unable to pull paid invoices. Try again later.'})
            }
        )
})

ROUTER.post('/create', (req, res) => {
    invoiceService
        .createInvoice(req.body.ticketId)
        .then(
            () => {
                res.status(201)

                ticketService
                    .updateTicketInvoiceDate(req.body.ticketId)
                    .then(
                        () => {
                            res.json({ message: `Invoice for load ${req.body.tmsLoad} created successfully!` })
                        },
                        (err) => {
                            console.error(err);
                            res.json({ message: `Invoice for load ${req.body.tmsLoad} created successfully!. Unable to update ticket invoice date.` })
                        } 
                    )
            },
            (err) => {
                console.error(err);

                res.status(500)
                res.json({ error: `Unable to create invoice for load ${req.body.tmsLoad} created successfully!` })
            }
        );
})

ROUTER.post('/pay', (req, res) => {
    invoiceService
        .updatePayment(req.body.id, req.body.payment)
        .then(
            () => {
                res.status(200)
                res.json({ message: `Payment ${req.body.payment} has been applied to invoice ${req.body.id}` })
            },
            (err) => {
                console.error(err);

                res.status(500)
                res.json({ error: `Unable to bind payment ${req.body.payment} to invoice ${req.body.id}!` })
            }
        )
})

ROUTER.get('/view/:invoiceId', (req, res) => {
    invoiceService
        .viewInvoice(req.params.invoiceId)
        .then(
            (invoice) => {
                res.status(200);
                res.json(invoice);
            },
            (err) => {
                console.error(err);

                res.status(500)
                res.json({ error: `Unable to get invoice ${rreq.params.invoiceId}. Please try again.` })
            }
        )
});

exports.router = ROUTER;