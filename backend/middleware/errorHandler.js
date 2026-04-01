const fs = require('fs');
const path = require('path');
const errorHandler = (err, req, res, next) => {
    const errlog = ("An error happened:", err.message);

    fs.appendFile(
        path.join(__dirname, '..', 'logs', 'errorLog.txt'),
        errlog,
        (error) => {
            if (error) console.error("Logging failed:", error);
        }
    );
    res.status(500).json({
        success: false,
        message: "Server threw an exception",
        error: err.message
    });
};
module.exports = errorHandler;