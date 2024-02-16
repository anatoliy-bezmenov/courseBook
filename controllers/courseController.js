const router = require('express').Router();

const courseService = require('../services/courseService');
const { getErrorMessage } = require('../utils/errorUtils');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/', async (req, res) => {
    const courses = await courseService.getAll().lean();
    res.render('courses/catalog', { courses })
});

router.get('/:courseId/details', async (req, res) => {
    const course = await courseService.getOneDetailed(req.params.courseId).lean();

    const signedUpUsers = course.signUpList.map(user => user.username).join(', ');
    const isOwner = course.owner && course.owner._id == req.user?._id; // use double "=". not triple
    const isSigned = course.signUpList.some(user => user._id == req.user?._id);

    res.render('courses/details', { ...course, signedUpUsers, isOwner, isSigned });
});

router.get('/:courseId/sign-up', async (req, res) => {
    // try {
        await courseService.signUp(req.params.courseId, req.user._id);
        res.redirect(`/courses/${req.params.courseId}/details`);
    // } catch(err) {
    //     res.render('courses/details')
    // }
})

router.get('/create', isAuth, (req, res) => {
    res.render('courses/create');
});

router.post('/create', isAuth, async (req, res) => {
    const courseData = req.body;
    try {
        await courseService.create(req.user._id, courseData);
        res.redirect('/courses');
    } catch(err) {
        res.render('courses/create', { ...courseData, error: getErrorMessage(err) })
    }
});

router.get('/:courseId/edit', isCourseOwner, async (req, res) => {
    const course = await courseService.getOne(req.params.courseId).lean();
    res.render('courses/edit', { ...course })

    // res.render('/courses/edit', {...req.course}) // don't need above 2 lines if req.course is set in
    // // isCourseOwner function
});

router.post('/:courseId/edit', isCourseOwner, async (req, res) => {
    const courseData = req.body;

    try {
        await courseService.edit(req.params.courseId, courseData);

        res.redirect(`/courses/${req.params.courseId}/details`);
    } catch(err) {
        res.render('courses/edit', {... courseData, error: getErrorMessage(err) });
    };
});

router.get('/:courseId/delete', isCourseOwner, async (req, res) => {
    await courseService.delete(req.params.courseId);

    res.redirect('/courses');
})

async function isCourseOwner(req, res, next) {
    const course = await courseService.getOne(req.params.courseId).lean();

    if (course.owner != req.user?._id) {
        return res.redirect(`/courses/${req.params.courseId}/details`);
    };

    // req.course = course; // can re-use in get(edit)
    next();
};

module.exports = router;