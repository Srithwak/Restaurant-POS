const path = require('path');

module.exports = {
    paths: {
        menu: path.join(__dirname, '../storage/menu.json'),
        orders: path.join(__dirname, '../storage/orders.json'),
        logs: path.join(__dirname, '../storage/logs/app.log')
    },
    settings: {
        refreshInterval: 5000,
        developmentMode: process.env.NODE_ENV === 'development' || true,
        maxOrderItems: 20,
        maxQuantityPerItem: 10
    },
    validation: {
        minPrice: 0.01,
        maxPrice: 1000,
        maxOrderTotal: 500
    }
};