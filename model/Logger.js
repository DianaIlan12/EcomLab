module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define('log', {
        payId: {
            type: Sequelize.STRING
        },
        request: {
            type: Sequelize.TEXT('long')
        },
        response: {
            type: Sequelize.TEXT('long')
        }
    }, {
        tableName: 'logs'
    });

    return Log;
} 