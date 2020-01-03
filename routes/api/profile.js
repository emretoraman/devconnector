const express = require('express');
const router = express.Router();
const request = require('request');
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   GET api/profile
// @desc    Get profiles
// @access  Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find()
            .populate('user', ['name', 'avatar']);

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/me
// @desc    Get current profile
// @access  Private
router.get('/me', auth, async (req, res) => { 
    try {
        const profile = await Profile.findOne({ user: req.user.id })
            .populate(
                'user',
                ['name', 'avatar']
            );
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/:user_id
// @desc    Get profile by user_id
// @access  Public
router.get('/:user_id', async (req, res) => { 
    try {
        const profile = await Profile.findOne({ user: req.params.user_id })
            .populate(
                'user',
                ['name', 'avatar']
            );
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Upsert profile
// @access  Private
router.post('/', [ 
    auth, 
    check('status', 'Status is required').notEmpty(),
    check('skills', 'Skills is required').notEmpty()
],
async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;


    try {
        // Using upsert option (creates new doc if no match is found):
        let profile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );
        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile
// @desc    Delete current user, profile and posts
// @access  Private
router.delete('/', auth, async (req, res) => { 
    try {
        // @todo: delete posts

        // Delete profile
        await Profile.findOneAndDelete({ user: req.user.id });

        // Delete user
        await User.findOneAndDelete({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile/experience
// @desc    Create experience
// @access  Private
router.post('/experience', [ 
    auth, 
    check('title', 'Title is required').notEmpty(),
    check('company', 'Company is required').notEmpty(),
    check('from', 'From date is required').notEmpty()
],
async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    // Build experience object
    const experienceFields = {};
    if (title) experienceFields.title = title;
    if (company) experienceFields.company = company;
    if (location) experienceFields.location = location;
    if (from) experienceFields.from = from;
    if (to) experienceFields.to = to;
    if (current) experienceFields.current = current;
    if (description) experienceFields.description = description;

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.experience.unshift(experienceFields);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/experience/:id
// @desc    Delete experience
// @access  Private
router.delete('/experience/:id', auth, async (req, res) => { 
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.experience.findIndex(item => item.id.toString() === req.params.id);
        if (removeIndex === -1) {
            return res.status(400).json({ msg: 'There is no experience with this id' });
        }

        profile.experience.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile/education
// @desc    Create education
// @access  Private
router.post('/education', [ 
    auth, 
    check('school', 'School is required').notEmpty(),
    check('degree', 'Degree is required').notEmpty(),
    check('fieldofstudy', 'Field of study is required').notEmpty(),
    check('from', 'From date is required').notEmpty()
],
async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    // Build education object
    const educationFields = {};
    if (school) educationFields.school = school;
    if (degree) educationFields.degree = degree;
    if (fieldofstudy) educationFields.fieldofstudy = fieldofstudy;
    if (from) educationFields.from = from;
    if (to) educationFields.to = to;
    if (current) educationFields.current = current;
    if (description) educationFields.description = description;

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        profile.education.unshift(educationFields);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile/education/:id
// @desc    Delete education
// @access  Private
router.delete('/education/:id', auth, async (req, res) => { 
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        const removeIndex = profile.education.findIndex(item => item.id.toString() === req.params.id);
        if (removeIndex === -1) {
            return res.status(400).json({ msg: 'There is no education with this id' });
        }
        
        profile.education.splice(removeIndex, 1);
        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/github/:username
// @desc    Get github repos by github username
// @access  Public
router.get('/github/:username', async (req, res) => { 
    try {
        const options = {
            uri: encodeURI(`https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientID')}&client_secret=${config.get('githubClientSecret')}`),
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
    
        request(options, (err, response, body) => {
            if (err) {
                console.error(err);
                res.status(500).send('Server Error');
            }

            if (response.statusCode !== 200) {
                return res.status(404).json({ msg: 'No Github profile found' });
            }

            res.json(JSON.parse(body));
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
