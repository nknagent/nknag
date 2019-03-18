
const IPv4 = require('ip-address').Address4;
const Router = require('koa-router');
const debug = require('debug')('nknag:router');

const db = require('./db.json');

const router = new Router();

router
    .get('/', (ctx, next) => {
        ctx.body = 'Hello nkn-ian!';
        next();
    })
    .get('/server', (ctx, next) => {
        ctx.body = db.serverList;
        next();
    })
    .get('/server/authKey', (ctx, next) => {
        ctx.body = ctx.header.authorization;
        next();
    })
    .put('/server/:ip', (ctx, next) => {
        const IP = ctx.params.ip;

        debug(`IP Address: ${IP}`);

        if (new IPv4(IP).isValid()) {
            if (db.serverList.indexOf(IP) !== -1) {
                ctx.body = 'Already Added.';
            } else {
                db.serverList.push(IP);
                ctx.body = 'OK.';
            }
        } else {
            ctx.body = `Wrong IP Address: ${IP}`;
        }

        next();
    });

module.exports = { router, db };
