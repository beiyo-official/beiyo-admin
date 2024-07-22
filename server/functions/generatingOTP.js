const crypto = require('crypto');

const genrateOTP = ()=>{
    return crypto.randomInt(100000,999999).toString();
}
module.exports = genrateOTP;