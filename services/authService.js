const bcrypt = require('bcrypt');
const jwt = require('../lib/jsonwebtoken');

const User = require('../models/User');

const { SECRET } = require('../services/config');

// REGISTER
exports.register = async (userData) => {
    if (userData.password != userData.rePassword) {
        throw new Error('Password missmatch!');
    };

    const user = await User.findOne({ email: userData.email });
    if (user) {
        throw new Error('User already exists');
    }

    const createdUser = await User.create(userData);
    const token = generateToken(createdUser);

    return token;
};

// LOGIN
exports.login = async (email, password) => {
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
        throw new Error('Cannot find email or password');
    }

    // Check if password is valid
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error('Cannot find email or password');
    }

    // Generate jwt token
    const token = await generateToken(user);

    return token;
};


function generateToken(user) {
    const payload = {
        _id: user._id,
        username: user.username,
        email: user.email,
    };

    return jwt.sign(payload, SECRET, { expiresIn: '2h' });
}

// BOTH ASYNC AND SYNCH WAYS WORK BUT USE 1

// async function generateToken(userObject) {
//     const payload = {
//         _id: user._id,
//         username: user.username,
//         email: user.email,
//     };
//     const token = await jwt.sign(payload, SECRET, { expiresIn: '2h' });

//     return token;
// }