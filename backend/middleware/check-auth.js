const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (request, response, next) => {
    try {
        const token = request.headers.auth.split(' ')[1];
        const decodedToken = jwt.verify(token, "15ea6799-72a6-4daa-90a6-68b2acc28980");
        request.userData = { email: decodedToken.email, userId: decodedToken.userId },
            next();
    } catch (error) {
        response.status(401).json({
            error: {
                message: "Not authorized"
            }
        });
    }

}