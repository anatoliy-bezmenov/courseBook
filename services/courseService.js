const Course = require('../models/Course');
const User = require('../models/User');

exports.getOne = (courseId) => {
    return Course.findById(courseId);
    // return Course.findById(courseId).populate('owner');
}

exports.getOneDetailed = (courseId) => {
    return this.getOne(courseId).populate('owner').populate('signUpList');
};

exports.getAll = () => {
    return Course.find();
};

exports.getLatest = () => {
    return Course.find().sort({ createdAt: -1 }).limit(3);
};

// exports.getLatest = (courses) => {
//     return Course.find();
// };

exports.signUp = async (courseId, userId) => {
    // await Course.findByIdAndUpdate(courseId, {$push: {signUpList: userId}}); // should also work
    // await User.findByIdAndUpdate(userId, {$push: {signedUpList: courseId}});

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    course.signUpList.push(userId);
    user.signedUpCourses.push(courseId);

    await course.save();
    await user.save();
};

exports.create = async (userId, courseData) => {
    const createdCourse = await Course.create({
        owner: userId,
        ...courseData,
    });

    await User.findByIdAndUpdate(userId, {$push: { createdCourses: createdCourse._id }});

    return createdCourse;
};

exports.edit = (courseId, courseData) => {
    return Course.findByIdAndUpdate(courseId, courseData, { runValidators: true }); // checks the
    // validators in Course model (Course.js) with the option set to true
}

exports.delete = (courseId) => {
    return Course.findByIdAndDelete(courseId);
};