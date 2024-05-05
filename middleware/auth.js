const jwt = require('jsonwebtoken');

function verifyAccessToken(token) {
    const secret = 'webcup-debug-thugs';

    try {
        const decoded = jwt.verify(token, secret);
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// middleware to validate JWT token
exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }

        const result = verifyAccessToken(token);

        if (!result.success) {
            return res.status(403).json({
                success: false,
                error: result.error
            });
        }

        req.user = result.data;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized"
            });
        }

        const result = verifyAccessToken(token);

        if (!result.success) {
            return res.status(403).json({
                success: false,
                error: result.error
            });
        }

        req.user = result.data;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
