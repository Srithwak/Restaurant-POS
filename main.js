const { app, BrowserWindow } = require('electron')
const path = require('path');
const fs = require('fs');

const isDev = true; // Set to true for debugging

function createMainWindow() {
   const mainWindow = new BrowserWindow({
      title: 'Restaurant POS',
      width: 1024,
      height: 768,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
         enableRemoteModule: true
      }
   });

   // Open DevTools by default for easier debugging
   if (isDev) {
      mainWindow.webContents.openDevTools();
   }

   mainWindow.loadFile('./kiosk/kiosk.html').catch(err => {
      console.error('Error loading kiosk.html:', err);
   });
}

function createOrderWindow() {
   const orderWindow = new BrowserWindow({
      title: 'Order Management',
      width: 1024,
      height: 768,
      webPreferences: {
         nodeIntegration: true,
         contextIsolation: false,
         enableRemoteModule: true
      }
   });

   // Open DevTools by default for easier debugging
   if (isDev) {
      orderWindow.webContents.openDevTools();
   }

   orderWindow.loadFile('./orders/orders.html').catch(err => {
      console.error('Error loading orders.html:', err);
   });
}

app.whenReady().then(() => {
   createMainWindow();
   createOrderWindow();

   app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
         createMainWindow();
         createOrderWindow();
      }
   });
});

app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit();
   }
});