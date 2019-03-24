
// const IPv4 = require('ip-address').Address4;
const Router = require('koa-router');
const debug = require('debug')('nknag:router');

const router = new Router();

const IP_VALIDATE = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;
const IP_EXTRACT = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/gm;

// ROUTE - RENDER
router
    .get('/', async (ctx, next) => {
        await ctx.render('index', { servers: Object.keys(global.DB.serverList), DB: global.DB.serverList });
        next();
    })
    .get('/server/add', async (ctx, next) => {
        await ctx.render('server/add', { result: '' });
        next();
    })
    .post('/server/add', async (ctx, next) => {
        ctx.body = ctx.request.body;

        const IPs = (ctx.body.server).match(IP_EXTRACT);

        if (IPs === null || !Array.isArray(IPs)) {
            await ctx.render('server/add', { result: 'Error!' });
            return next();
        }

        debug(`Total IPs extracted: ${IPs.length || 0}`);

        const promises = [];

        let err = 0;
        let added = 0;

        debug('Save DB to db.json and STOP DB_save_interval');

        clearInterval(global.DB.saveID);
        await global.DB.save();

        IPs.forEach((IP) => {
            promises.push(
                new Promise((resolve) => {
                    if (IP_VALIDATE.test(IP)) {
                        if (typeof global.DB.serverList[IP] === 'object') {
                            err += 1;
                        } else {
                            global.DB.serverList[IP] = { NodeWalletDAT: {}, by: 'Manual', lastUpdate: Date().toString() };
                            added += 1;
                        }
                    } else {
                        err += 1;
                    }

                    setTimeout(resolve, 100);
                // eslint-disable-next-line no-return-assign
                }).catch(undefined),
            );
        });

        await global.DB.save();
        global.DB.saveInterval();

        debug('Save DB to db.json and START DB_save_interval');

        return Promise.all(promises).then(async () => {
            await ctx.render('server/add', { result: `Added: ${added} - Error: ${err}` });

            next();
        });
    })
    .get('/server/remove', async (ctx, next) => {
        await ctx.render('server/remove', { result: '' });
        next();
    })
    .post('/server/remove', async (ctx, next) => {
        ctx.body = ctx.request.body;

        const IPs = (ctx.body.server).match(IP_EXTRACT);

        if (IPs === null || !Array.isArray(IPs)) {
            await ctx.render('server/add', { result: 'Error!' });
            return next();
        }

        debug(`Total IPs extracted: ${IPs.length || 0}`);

        const promises = [];

        let err = 0;
        let added = 0;

        debug('Save DB to db.json and STOP DB_save_interval');

        clearInterval(global.DB.saveID);
        await global.DB.save();

        IPs.forEach((IP) => {
            promises.push(
                new Promise((resolve) => {
                    if (IP_VALIDATE.test(IP) && typeof global.DB.serverList[IP] === 'object') {
                        delete global.DB.serverList[IP];

                        if (typeof global.DB.serverList[IP] === 'undefined') {
                            added += 1;
                        } else {
                            err += 1;
                        }
                    } else {
                        err += 1;
                    }

                    setTimeout(resolve, 100);
                // eslint-disable-next-line no-return-assign
                }).catch(undefined),
            );
        });

        await global.DB.save();
        global.DB.saveInterval();

        debug('Save DB to db.json and START DB_save_interval');

        return Promise.all(promises).then(async () => {
            await ctx.render('server/add', { result: `Removed: ${added} - Error: ${err}` });
            next();
        });
    });

// ROUTE - API
router
    .get('/server', (ctx, next) => {
        ctx.body = 'Hello nkn-ian!';
        next();
    })
    .get('/server/authKey', (ctx, next) => {
        ctx.body = ctx.header.authorization.split(' ')[1] || '';
        next();
    })
    .post('/server/add/:ip', (ctx, next) => {
        ctx.body = ctx.request.body;

        const IP = ctx.params.ip;

        debug(`IP Address: ${IP}`);
        debug(ctx.body);

        try {
            if (IP_VALIDATE.test(IP)) {
                const json = ctx.body;
                json['NKN.Service'] = decodeURIComponent(ctx.body['NKN.Service'].replace(/\+/g, ' ').replace('   ', '')).replace(/[\r\n]+/g, '') || '';
                json.BeneficiaryAddr = (ctx.body.BeneficiaryAddr.length > 0) ? decodeURIComponent(ctx.body.BeneficiaryAddr).match(/BeneficiaryAddr":\+"(.*)",/)[1] : '';
                json.NodeWalletDAT = (ctx.body.BeneficiaryAddr.length > 0) ? JSON.parse(decodeURIComponent(ctx.body.NodeWalletDAT.replace(/\+/g, ' ').replace(/[\r\n]+/g, ''))) : '';

                debug(json.NodeWalletDAT);

                global.DB.serverList[IP] = Object.assign({}, json, { by: 'nknag-client', lastUpdate: Date().toString() });
                ctx.body = 'OK.';
            } else {
                ctx.body = `Wrong IP Address: ${IP}`;
            }
        } catch (error) {
            debug(error);

            ctx.body = 'Error';
        } finally {
            next();
        }
    });

module.exports = router;
