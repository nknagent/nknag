const fs = require('fs');
const path = require('path');
const debug = require('debug')('nknag:app');

global.config = require('./config.json');

if (fs.existsSync(path.resolve(__dirname, '../db.json'))) {
    global.DB = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../db.json')));
} else {
    global.DB = { serverList: [] };
}

global.DB.save = () => {
    debug('Save DB');
    return fs.writeFileSync(path.resolve(__dirname, './db.json'), JSON.stringify({ serverList: global.DB.serverList }, null, 2), 'utf8');
};
global.DB.saveInterval = () => {
    global.DB.saveID = setInterval(global.DB.save, global.config.DB.saveInterval);
};
global.DB.saveInterval();

require('./server/app');
