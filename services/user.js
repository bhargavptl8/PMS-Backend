const jwt = require('jsonwebtoken');

exports.checkAuthentication = async (token) => {
    try {
        if (!token) {
            throw new Error("Please send token!");
        }
        await jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Unauthorized! Please send legal token');
        }
        // Log the error for debugging but throw a generic error for security
        throw new Error(error?.message);
    }
}
