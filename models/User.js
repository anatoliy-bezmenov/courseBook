const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        minLength: [2, 'Username should be at least 2 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        minLength: [10, 'Email should be at least 10 characters'],
        unique: true,
        // lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [4, 'Password should be at least 4 characters'],
    },
    createdCourses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
    signedUpCourses: [{
        type: mongoose.Types.ObjectId,
        ref: 'Course',
    }],
});

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 12);

    // const hash = await bcrypt.hash(this.password, 12);
    // this.password = hash;

});

// userSchema.virtual('rePassword').set(function(value) {
//     if (value !== this.password) {
//         throw new Error('Password missmatch!');
//     }
// })

// Don't use above if we check the password in authService.js in exports.register

// // userSchema.virtual('rePassword').set(function(value) {
// //     // // Validate
// //     try {
// //         if (value !== this.password) {
// //             throw new mongoose.MongooseError('Password missmatch!');
// //         }
// //     } catch(err) {
// //         res.render('auth/register', { error: 'Password missmatch!'});
// //     }
// //     // this.rePassword = value;
// // });

const User = mongoose.model('User', userSchema);

module.exports = User;