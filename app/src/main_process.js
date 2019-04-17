// Basic init
const electron = require('electron')
const {app, BrowserWindow} = electron

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {

    // ***NOTE***
    // Set CSP before release
    
    mainWindow = new BrowserWindow(
      {
        width: 800, 
        height: 600,
        icon: "./assets/raven.png",
        webPreferences: {
          nodeIntegration: true,
        },
      }
    )

    mainWindow.loadFile(`./app/index.html`)

    // installExtension.default(installExtension.REACT_DEVELOPER_TOOLS)
    // .then((name) => console.log(`Added Extension:  ${name}`))
    // .catch((err) => console.log('An error occurred: ', err));

    // installExtension.default(installExtension.REDUX_DEVTOOLS)
    // .then((name) => console.log(`Added Extension:  ${name}`))
    // .catch((err) => console.log('An error occurred: ', err));

    // mainWindow.webContents.openDevTools()

})
