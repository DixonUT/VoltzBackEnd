const jwt = require('jsonwebtoken');
const { getUserById } =require('../db/models/users');


async function requireAuth(req, res, next) { 
    // get the token out of the authorization header
    const authHeader = req.header('Authorization');

    // if the token is not valid
    if(!authHeader) {
        // then throw auth error
        next({
            name: 'AuthorizationError', 
            message: 'Authorization Failed'
        });
        return;
    }  

    // otherwise, validate the JWT
    try {
        const token = authHeader.replace('Bearer ', '');

        // validate the JWT 
        const parsedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Set the user from the JWT
        const id = parsedToken && parsedToken.userId;

        if(id) {
            // get the user by the id we were provided
            req.user = await getUserById(parsedToken.userId);
        }
        next();
    } catch(err) {
        next(err);
    }
}

module.exports = { requireAuth }