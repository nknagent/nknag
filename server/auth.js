
const mount = require('koa-mount');
const auth = require('koa-basic-auth');

// require auth
// custom 401 handling

module.exports = {
    mount: mount('/', auth({ name: global.config.auth.username, pass: global.config.auth.pwd })),
    h401: async (ctx, next) => {
        try {
            await next();
        } catch (err) {
            if (err.status === 401) {
                ctx.status = 401;
                ctx.set('WWW-Authenticate', 'Basic');
                ctx.body = 'Athorization Failed.';
            } else {
                throw err;
            }
        }
    },
};
