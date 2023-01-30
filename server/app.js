// app.js
const Koa = require('koa');
const Pug = require('koa-pug');

const path = require('path');

const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const auth = require('./auth');
const router = require('./router');

const app = new Koa();
// eslint-disable-next-line no-unused-vars
const pug = new Pug({
    viewPath: path.resolve(__dirname, './views'),
    basedir: path.resolve(__dirname, './views'),
    app, // Equivalent to app.use(pug)
});

app.use(bodyParser());
app.use(logger());

//app.use(auth.h401);
//app.use(auth.mount);

app.use(router.routes());
app.use(router.allowedMethods());

const server = app.listen(3000, '0.0.0.0');

module.exports = server;
