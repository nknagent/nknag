
const mount = require('koa-mount');
const auth = require('koa-basic-auth');
const config = require('./config.json');

// require auth
// custom 401 handling

module.exports = {
    mount: mount('/server', auth({ name: config.auth.username, pass: config.auth.pwd })),
    h401: async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.set('WWW-Authenticate', 'Basic');
                ctx.body = 'cant haz that';
            } else {
                throw err;
            }
        }
    },
};
