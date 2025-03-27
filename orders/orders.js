const fs = require('fs');
const path = require('path');

const refreshTime = 5000; // 5 seconds

const ordersPath = path.join(__dirname, '../storage/orders.json');


function loadOrders() {
    let orders = [];
    
    try {
        orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    } catch (error) {
        console.error('No orders file found');
        return;
    }
    
    const activeOrdersContainer = document.getElementById('active-orders');
    const completedOrdersContainer = document.getElementById('completed-orders');
    
    activeOrdersContainer.innerHTML = '<h2>Active Orders</h2>';
    completedOrdersContainer.innerHTML = '<h2>Completed Orders</h2>';
    
    orders.forEach(order => {
        const orderEl = document.createElement('div');
        orderEl.classList.add('order');
        
        let totalPrice = order.items.reduce((sum, item) => sum + item.price, 0);
        
        orderEl.innerHTML = `
            <p>Order #${order.id}</p>
            <p>Time: ${new Date(order.timestamp).toLocaleString()}</p>
            <ul>
                ${order.items.map(item => `<li>${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p>Total: $${totalPrice.toFixed(2)}</p>
            ${order.status === 'active' 
                ? `<button onclick="completeOrder(${order.id})">Complete Order</button>` 
                : ''}
        `;
        
        if (order.status === 'active') {
            activeOrdersContainer.appendChild(orderEl);
        } else {
            completedOrdersContainer.appendChild(orderEl);
        }
    });
}

function completeOrder(orderId) {
    let orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'completed';
        fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
        loadOrders();
    }
}

window.onload = () => {
    loadOrders();
    setInterval(loadOrders, refreshTime);
};
