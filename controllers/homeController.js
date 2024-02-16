const router = require('express').Router();

const { isAuth } = require('../middlewares/authMiddleware');
const courseService = require('../services/courseService');
const userService = require('../services/userService');
const Course = require('../models/Course');

router.get('/', async (req, res) => {
    const latestCourses = await courseService.getLatest().lean();
    
    res.render('home', { latestCourses });
    
    // let last3 = latestCourses.slice(-3);
    // res.render('home', { courses: last3 });
});

router.get('/profile', isAuth, async (req, res) => {
    const user = await userService.getInfo(req.user._id).lean();
    const createdCoursesCount = user.createdCourses?.length // || 0;
    const signedUpCoursesCount = user.signedUpCourses?.length // || 0;

    // const createdCourses = await Course.find({owner: req.user._id}); // don't use unless need (?)
    // const signedUpCourses = await Course.find({signUpList: req.user._id });

    res.render('profile', { user, createdCoursesCount, signedUpCoursesCount });
})

// // TODO: Delete below router.get() since it was only for testing purposes
// router.get('/authorize-test', isAuth, (req, res) => {
//     res.send('You are authorized');
// });

module.exports = router;