const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next(); // Proceed to the next middleware or route handler
    } catch {
        res.status(403).json({ error: 'Invalid token.' });
    }
}

module.exports = auth;