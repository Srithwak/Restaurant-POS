const fs = require('fs');
// const path = require('path');
const config = require('../utils/config.js');
const logger = require('../utils/logger.js');
const Validator = require('../utils/validation.js');

const menuPath = config.paths.menu;
const ordersPath = config.paths.orders;

let currentOrder = [];

function loadMenu() {
    let menu;
    try {
        menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    } catch (error) {
        console.error('No menu file found');
        return;
    }

    const categoriesContainer = document.getElementById('menu-categories');

    menu.forEach(category => {
        const categoryEl = document.createElement('button');
        categoryEl.textContent = category.name;
        categoryEl.addEventListener('click', () => {
            showCategoryItems(category);
            highlightCategory(categoryEl);
        });
        categoriesContainer.appendChild(categoryEl);
    });

    if (menu.length > 0) {
        showCategoryItems(menu[0]);
        highlightCategory(categoriesContainer.children[0]);
    }
}

function showCategoryItems(category) {
    const menuItemsContainer = document.getElementById('menu-items');
    menuItemsContainer.innerHTML = '';

    category.items.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('menu-item');
        itemEl.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
            <div class="counter">
                <button onclick="changeQuantity('${item.name}', -1)">-</button>
                <span id="qty-${item.name.replace(/\s+/g, '-')}">1</span>
                <button onclick="changeQuantity('${item.name}', 1)">+</button>
            </div>
            <button type="button" onclick="addToOrder('${item.name}', ${item.price})">Add</button>`;
        menuItemsContainer.appendChild(itemEl);
    });
}

function highlightCategory(selectedCategory) {
    const categoriesContainer = document.getElementById('menu-categories');
    Array.from(categoriesContainer.children).forEach(categoryEl => {
        categoryEl.classList.remove('active-category');
    });
    selectedCategory.classList.add('active-category');
}

function changeQuantity(name, change) {
    const qtySpan = document.getElementById(`qty-${name.replace(/\s+/g, '-')}`);
    let currentQty = parseInt(qtySpan.textContent, 10);
    currentQty = Math.max(1, currentQty + change);
    qtySpan.textContent = currentQty;
}

function addToOrder(name, price) {
    const qtySpan = document.getElementById(`qty-${name.replace(/\s+/g, '-')}`);
    const quantity = parseInt(qtySpan.textContent, 10);

    const existingItem = currentOrder.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        currentOrder.push({ name, price, quantity });
    }

    updateOrderDisplay();
}

function updateOrderDisplay() {
    const orderList = document.getElementById('order-list');
    const orderTotal = document.getElementById('order-total');
    
    orderList.innerHTML = '';
    let total = 0;
    
    currentOrder.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${item.name} - $${item.price.toFixed(2)} x ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}
            <button onclick="removeFromOrder(${index})">Remove</button>
        `;
        orderList.appendChild(li);
        total += item.price * item.quantity;
    });
    
    orderTotal.textContent = `Total: $${total.toFixed(2)}`;
}

function removeFromOrder(index) {
    currentOrder.splice(index, 1);
    updateOrderDisplay();
}

function submitOrder() {
    if (currentOrder.length === 0) {
        alert('Order is empty!');
        return;
    }
    
    let orders = [];
    
    try {
        orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    } catch (error) {
        console.error('No orders file found');
    }
    
    const newOrder = {
        id: Date.now(),
        items: currentOrder,
        timestamp: new Date().toISOString(),
        status: 'active'
    };
    
    orders.push(newOrder);
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    alert('Order submitted successfully!');
    
    currentOrder = [];
    updateOrderDisplay();

    document.querySelectorAll('.counter span').forEach(qtySpan => {
        qtySpan.textContent = '1';
    });
}

document.getElementById('submit-order').addEventListener('click', submitOrder);
window.onload = loadMenu;