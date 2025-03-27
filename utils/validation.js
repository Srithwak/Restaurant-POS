const config = require('./config');
const logger = require('./logger');

class Validator {
    static validateMenuItem(item) {
        if (!item || !item.name || typeof item.name !== 'string') {
            logger.throwError('Invalid item name', { item });
        }

        if (!item.price || 
            typeof item.price !== 'number' || 
            item.price < config.validation.minPrice || 
            item.price > config.validation.maxPrice) {
            logger.throwError('Invalid item price', { item });
        }
    }

    static validateOrder(order) {
        if (!order || !Array.isArray(order) || order.length === 0) {
            logger.throwError('Order cannot be empty');
        }

        if (order.length > config.settings.maxOrderItems) {
            logger.throwError(`Order cannot exceed ${config.settings.maxOrderItems} items`);
        }

        let totalOrderPrice = 0;
        order.forEach(item => {
            this.validateMenuItem(item);

            if (!item.quantity || 
                typeof item.quantity !== 'number' || 
                item.quantity < 1 || 
                item.quantity > config.settings.maxQuantityPerItem) {
                logger.throwError(`Invalid quantity for item ${item.name}`);
            }

            totalOrderPrice += item.price * item.quantity;
        });

        if (totalOrderPrice > config.validation.maxOrderTotal) {
            logger.throwError(`Order total exceeds ${config.validation.maxOrderTotal}`);
        }
    }
}

module.exports = Validator;