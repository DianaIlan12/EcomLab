const _TBC_METHODS = require('../controller/TBC');
const db = require('../config/db');
const Card = db.cards;
const { Op } = require("sequelize");

exports.create = async (dataForCard) => {
    Card.create(dataForCard)
}

exports.findAll = (req, res) => {
    Card.findAll({
        where: {
            cardMask: {
                [Op.ne]: null
            }
        }
    })
        .then(cards => {
            res.status(200).json(cards)
        }).catch(err => {
            res.status(400).json(err)
        })
}

exports.update = async (values, condition) => {
    Card.update(values, condition)
}

exports.delete = async (req, res) => {
    const recId = req.params.recId;
    const deletionInfo = await _TBC_METHODS.rmRecId(recId)
    if (deletionInfo.details.httpStatusCode === 200) {
        Card.destroy({
            where: { recId }
        }).then(response => {
            res.status(200).json({ result: "ok" })
        }).catch(error => {
            res.status(404).json({ result: "failed" })
        })
    } else {
        res.status(400).json(deletionInfo)
    }
}