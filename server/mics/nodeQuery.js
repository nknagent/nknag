// eslint-disable

const jayson = require('jayson');

function getNodeState(ip, port = 30003) {
    return new Promise((resolve, reject) => {
        jayson.client
            .http({
                host: ip,
                port,
            })
            .request('getnodestate', {}, (err, error, result) => {
                if (err) reject(err);

                resolve(result);
            });
    });
}

function getNodeSState(servers) {
    return new Promise(async (resolve) => {
        const s = [];

        // eslint-disable-next-line no-restricted-syntax
        for (const sv of servers) {
            // eslint-disable-next-line no-await-in-loop
            s.push(await getNodeState(sv));
        }

        resolve(s);
    });
}

module.exports = {
    getNodeState,
    getNodeSState,
};
