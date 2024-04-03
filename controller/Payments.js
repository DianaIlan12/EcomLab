const db = require('../config/db');
const _TBC_METHODS = require('../controller/TBC');
const Payment = db.payments;
const Card = db.cards;
const crypto = require('crypto');
const socket = require('../socket')
const axios = require('axios')

// Get Qr
exports.qr = async (req, res) => {
	const { id } = req.params;

	const qrUrl = await axios.get(`https://ecom.tbcpayments.ge/api/checkout/${id}`)

	const connection = socket.connection();
	if (connection) {
		connection.emit("message", qrUrl.data.features[0].qrContent);
	}
}

// Create Payment
exports.create = async (req, res) => {
	let dataForTBC = req.body
	let returnId = crypto.randomUUID()
	let returnUrl = `${process.env.RETURN_URL + returnId}`
	dataForTBC.returnurl = returnUrl;

	const createTBCPayment = await _TBC_METHODS.createPayment(dataForTBC)

	if (createTBCPayment.result !== 'failed') {
		let dataForDB = {
			payId: createTBCPayment.details.payId,
			status: createTBCPayment.details.status,
			returnId: returnId,
			currency: dataForTBC.amount.currency,
			amount: dataForTBC.amount.total,
			preAuth: dataForTBC.preAuth,
			saveCard: dataForTBC.saveCard,
			paymentMethod: dataForTBC.methods
		}

		let dataForCard = {
			recId: createTBCPayment.details.recId,
			owner: req.body.cardOwner
		}

		if (createTBCPayment.details.recId !== null) {
			await Card.create(dataForCard);
		}

		Payment.create(dataForDB).then(response => {
			if (createTBCPayment.result === "ok") {
				res.status(200).json(createTBCPayment.details)
			} else {
				res.status(400).json(createTBCPayment)
			}
		})
	} else {
		res.status(400).json(createTBCPayment)
	}
};

//Execute reccuring payment
exports.paymentExecution = async (req, res) => {
	let dataForTBC = req.body
	const execTBCPayment = await _TBC_METHODS.execPayment(dataForTBC)
	const payId = execTBCPayment.details.payId

	if (execTBCPayment.result !== 'failed') {
		let dataForDB = {
			payId: execTBCPayment.details.payId,
			status: execTBCPayment.details.status,
			currency: dataForTBC.money.currency,
			amount: dataForTBC.money.amount,
			preAuth: dataForTBC.preAuth,
			saveCard: "NO",
			paymentMethod: "Credit Card"
		}

		Payment.create(dataForDB).then(async response => {
			if (execTBCPayment.result === "ok") {
				let payInfo = execTBCPayment;

				updatePayment(payId, payInfo).then(resp => res.status(200).json(execTBCPayment.details))
			} else {
				res.status(400).json(execTBCPayment)
			}
		})
	} else {
		res.status(400).json(execTBCPayment)
	}
};
// Get All Payments
exports.findAll = async (req, res) => {
	let total_records = await Payment.count()
	let total_pages = Math.ceil(total_records / 10)
	let records_per_page = 10;
	let current_page = req.query.page ? parseInt(req.query.page) : 1

	Payment.findAll({
		order: [['createdAt', 'DESC']],
		limit: records_per_page,
		offset: (current_page * records_per_page) - 10
	})
		.then(payments => {
			res.status(200).json({
				totalRecords: total_records,
				totalPages: total_pages,
				currentPage: current_page,
				data: payments
			})
		}).catch(err => {
			res.status(400).json(err)
		})
}
// Find by Payment ID
exports.findByPayId = (req, res) => {
	Payment.findAll({
		where: {
			payId: req.params.payId
		}
	}).then(payment => {
		res.status(200).send(payment)
	}).catch(err => {
		console.log(err)
		res.status(400).json(err)
	})
};
// Find by Payment Status
exports.customFilter = (req, res) => {
	let obj = {}
	obj[req.params.filter] = req.params.query
	Payment.findAll({
		where: obj
	}).then(payment => {
		res.status(200).send(payment)
	}).catch(err => {
		console.log(err)
		res.status(400).json(err)
	})
};
// Check payment
exports.update = async (req, res) => {
	const payId = req.params.payId
	const payInfo = await _TBC_METHODS.getPayment(payId)

	if (payInfo.result !== 'failed') {
		if (payInfo.details.recurringCard !== null) {
			let values = {
				cardMask: payInfo.details.recurringCard.cardMask,
				expiryDate: payInfo.details.recurringCard.expiryDate
			}
			let condition = { where: { recId: payInfo.details.recurringCard.recId } }
			await Card.update(values, condition)
		}

		updatePayment(payId, payInfo).then(() => {
			res.status(200).send({ result: "ok", details: { status: payInfo.details.status } });
		}).catch(err => res.status(400).send({ result: "failed", details: { status: payInfo.details.status } }));
	} else {
		res.status(400).send({ result: "failed", details: { status: payInfo.details.status } })
	}
};
//Callback find and update
exports.callback = async (req, res) => {
	const searchKey = "paymentid"
	const payId = req.body[Object.keys(req.body).find(key => key.toLowerCase() === searchKey)]
	const payInfo = await _TBC_METHODS.getPayment(payId)

	if (payInfo.details.recurringCard !== null) {
		let values = {
			cardMask: payInfo.details.recurringCard.cardMask,
			expiryDate: payInfo.details.recurringCard.expiryDate
		}
		let condition = { where: { recId: payInfo.details.recurringCard.recId } }
		await Card.update(values, condition)
	}

	updatePayment(payId, payInfo).then(() => {
		if (payInfo.details.status === "Succeeded") {
			const connection = socket.connection();
			if (connection) {
				connection.emit("message", 'ok');
			}
		} else {
			const connection = socket.connection();
			if (connection) {
				connection.emit("message", 'fail');
			}
		}
		res.status(200).send({ result: "ok" });
	}).catch(err => {
		const connection = socket.connection();
		if (connection) {
			connection.emit("message", 'fail');
		}
		res.status(400).send({ result: "failed" })
	});
}
//Cancel Payment
exports.cancelPayment = async (req, res) => {
	const payId = req.params.payId
	const amount = req.body.amount
	const refundInfo = await _TBC_METHODS.cancelPayment(payId, amount)
	if (refundInfo.details.httpStatusCode === 200) {
		const payInfo = await _TBC_METHODS.getPayment(payId)

		updatePayment(payId, payInfo).then(() => {
			res.status(200).json({ result: "ok", details: refundInfo });
		}).catch(err => {
			res.status(400).json({ result: "failed", details: err.message })
		});
	} else if (refundInfo.result === 'failed') {
		res.status(400).json({ result: "failed", details: refundInfo.details })
	}
}
//Complition
exports.completePayment = async (req, res) => {
	const payId = req.params.payId
	const amount = req.body.amount
	const completeInfo = await _TBC_METHODS.completePayment(payId, amount)
	if (completeInfo.details.httpStatusCode === 200) {
		const payInfo = await _TBC_METHODS.getPayment(payId)

		updatePayment(payId, payInfo).then(() => {
			res.status(200).json({ result: "ok", details: completeInfo });
		}).catch(err => {
			res.status(400).json({ result: "failed", details: err.message })
		});
	} else if (completeInfo.result === 'failed') {
		res.status(400).json({ result: "failed", details: completeInfo.details })
	}
}

//Update DB AFTER ACTION
const updatePayment = async (payId, payInfo) => {
	Payment.update({
		status: payInfo.details.status,
		tranId: payInfo.details.transactionId,
		confirmedAmount: payInfo.details.confirmedAmount,
		returnedAmount: payInfo.details.returnedAmount,
		recId: payInfo.details.recurringCard == null ? null : payInfo.details.recurringCard.recId,
		expiryDate: payInfo.details.recurringCard == null ? null : payInfo.details.recurringCard.expiryDate,
		cardMask: payInfo.details.recurringCard == null || payInfo.details.recurringCard.cardMask == null ? payInfo.details.paymentCardNumber : payInfo.details.recurringCard.cardMask,
		paymentMethod: payInfo.details.paymentMethod == 4 ? "Web QR" : payInfo.details.paymentMethod == 5 ? "Credit Card" : payInfo.details.paymentMethod == 6 ? "Ertguli Points" : payInfo.details.paymentMethod == 7 ? "Internet Bank" : payInfo.details.paymentMethod == 9 ? "Apple Pay" : payInfo.details.paymentMethod == 11 ? "Reccuring" : null
	},
		{
			where: { payId }
		}
	)
}
