module.exports = (sequelize, Sequelize) => {
    const Payment = sequelize.define('payment', {
        payId: {
            type: Sequelize.STRING
        },
        tranId: {
            type: Sequelize.STRING
        },
        returnId: {
            type: Sequelize.STRING
        },
        status: {
            type: Sequelize.STRING
        },
        preAuth: {
            type: Sequelize.BOOLEAN
        },
        saveCard: {
            type: Sequelize.BOOLEAN
        },
        saveCardToDate: {
            type: Sequelize.STRING
        },
        recId: {
            type: Sequelize.STRING
        },
        cardMask: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.STRING
        },
        paymentMethod: {
            type: Sequelize.JSON
        },
        currency: {
            type: Sequelize.STRING
        },
        amount: {
            type: Sequelize.FLOAT
        },
        confirmedAmount: {
            type: Sequelize.FLOAT
        },
        returnedAmount: {
            type: Sequelize.FLOAT
        }
    }, {
        tableName: 'payments'
    });

    return Payment;
}