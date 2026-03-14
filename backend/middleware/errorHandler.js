const errorHandler = (err, req, res, next) => {
    console.error("Bruh, an error happened:", err.message);
    
    // Use error status if set, otherwise default to 500
    const statusCode = err.status || 500;
    
    res.status(statusCode).json({
        success: false,
        message: "Server threw an exception",
        error: err.message
    });
};

module.exports = errorHandler;