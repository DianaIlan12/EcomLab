module.exports = (sequelize, Sequelize) => {
    const Card = sequelize.define('card', {
        recId: {
            type: Sequelize.STRING
        },
        cardMask: {
            type: Sequelize.STRING
        },
        expiryDate: {
            type: Sequelize.STRING
        },
        owner: {
            type: Sequelize.STRING
        }
    }, {
        tableName: 'cards'
    });

    return Card;
}