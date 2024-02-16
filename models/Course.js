const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        minLength: [5, 'Title should be at least 5 characters'],
        required: true,
    },
    type: {
        type: String,
        minLength: [3, 'Type should be at least 2 characters'],
        required: true,
    },
    certificate: {
        type: String,
        minLength: [2, 'Certificate should be at least 2 characters'],
        required: true,
    },
    image: {
        type: String,
        match: [/^https?:\/\//, 'Invalid image url, must start with https'],
        required: true,
    },
    description: {
        type: String,
        minLength: [10, 'Description should be at least 10 characters'],
        required: true,
    },
    price: {
        type: Number,
        min: 0,
        required: true,
    },
    signUpList: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
    }],
    createdAt: Date,
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
});

courseSchema.pre('save', function() {
    if (!this.createdAt) {
        this.createdAt = Date.now();
    };
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;