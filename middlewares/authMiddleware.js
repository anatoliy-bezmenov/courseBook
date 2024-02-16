const jwt = require('../lib/jsonwebtoken');

const { SECRET } = require('../services/config');

exports.authMiddleware = async (req, res, next) => {
    const token = req.cookies['auth'];

    if (!token) { // if no token, then the user is guest
        return next();
    };

    try {
        const decodedToken = await jwt.verify(token, SECRET);

        req.user = decodedToken;
        res.locals.isAuthenticated = true;

        res.locals.user = decodedToken; // (used in catalog.hbs; currently commented out)

        next();
    } catch(err) {
        res.clearCookie('auth');
        res.redirect('/auth/login');
    }

};

exports.isAuth = (req, res, next) => {
    if (!req.user) {
        return res.redirect('/auth/login');
    };

    next();
};

exports.isGuest = (req, res, next) => { // if user is logged in, prevent him from accessing the login page
    // and the register page
    if (req.user) {
        return res.redirect('/');
    };

    next();
};