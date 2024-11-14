const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next(); 
    } else {
        res.status(403).json({ success: false, message: 'Access denied: Admins only' });
    }
};

module.exports = admin;
