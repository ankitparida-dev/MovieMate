const errorHandler = (err, req, res, next) => {
    console.error("Bruh, an error happened:", err.message);
    res.status(500).json({
        success: false,
        message: "Server threw an exception",
        error: err.message
    });
};
module.exports = errorHandler;