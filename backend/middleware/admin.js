const admin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    if (!req.user.isAdmin) {
        return res.status(403).json({
            message: "Admin access required"
        });
    }

    next();
};

module.exports = admin;