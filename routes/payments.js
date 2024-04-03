const payments = require('../controller/Payments');
const logs = require('../controller/Logs');
const express = require('express')
const router = express.Router()

//Create Payment
router.post('/', payments.create);
//Get Qr
router.get('/qr/:id', payments.qr)
//Get all Payment
router.get('/', payments.findAll)
//Find by payId
router.get('/:payId', payments.findByPayId)
//Get log by payId
router.get('/log/:payId', logs.findAll)
//Update by payId
router.put('/:payId', payments.update)
//Cancel Payment by payId
router.post('/:payId/cancel', payments.cancelPayment)
//Complition
router.post('/:payId/completion', payments.completePayment)
//Execute reccuring payment
router.post('/execution', payments.paymentExecution)
//Custom search like payId: test1234 || status: Failed
router.get('/:filter/:query', payments.customFilter)

router.get('/', (req, res) => {
  res.status(400).send("Wrong place")
})

module.exports = router;