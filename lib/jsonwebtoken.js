const util = require('util');
const jwt = require('jsonwebtoken');

// function sign(payload, secretOrPrivateKey, options = {}) {
//     const promise = new Promise((resolve, reject) => {
//         jwt.sign(payload, secretOrPrivateKey, options, (err, token) => {
//             if (err) {
//                 return reject(err);
//             }

//             resolve(token);
//         })
//     });

//     return promise;
// }

const sign = util.promisify(jwt.sign);
const verify = util.promisify(jwt.verify);

module.exports = {
    sign,
    verify,
};
