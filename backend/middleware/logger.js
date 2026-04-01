const fs = require('fs');
const path = require('path');
const logger = (req, res, next) => {
    const log = (`${req.method} request to ${req.url}`);
    fs.appendFile(
        path.join(__dirname, '..', 'logs', 'requests.txt'),
        log,
        (err) => {
            if (err) console.error(err);
        }
    );
    next(); 
};
module.exports = logger;