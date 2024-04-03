const db = require('../config/db');
const Log = db.logs;

const _LOG_METHODS = {}

_LOG_METHODS.create = async (payId, req, res) => {
    return await Log.create({
        payId,
        request: req,
        response: res
    })
}

_LOG_METHODS.findAll = async (req, res) => {
    let result = await Log.findAll({
        where: {
            payId: req.params.payId
        },
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true,
    })

    res.status(200).json(result)
}

module.exports = _LOG_METHODS