// app.js
const fs = require('fs');
const Koa = require('koa');

const logger = require('koa-logger');
const debug = require('debug')('nknag:app');

const config = require('./config.json');

const auth = require('./auth');
const R = require('./router');

const app = new Koa();

app.use(logger());

app.use(auth.h401);
app.use(auth.mount);

app.use(R.router.routes());
app.use(R.router.allowedMethods());

const server = app.listen(3000);

setInterval(() => {
    debug('Save DB');

    fs.writeFileSync('./db.json', JSON.stringify(R.db, null, 2), 'utf8');
}, config.DB.saveInterval);

module.exports = server;
