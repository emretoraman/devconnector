const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');

const Post = require('../../models/Post');
const User = require('../../models/User');

// @route   GET api/posts
// @desc    Get posts
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get post
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    POST api/posts
// @desc     Create post
// @access   Private
router.post('/', [ 
    auth, 
    check('text', 'Text is required').notEmpty()
],
async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        text
    } = req.body;

    // Build post object
    const postFields = {};
    postFields.user = req.user.id;
    const user = await User.findById(req.user.id);
    postFields.name = user.name;
    postFields.avatar = user.avatar;
    if (text) postFields.text = text;

    try {
        let post = new Post(postFields);
        post = await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, async (req, res) => { 
    try {
        const post = await Post.findById(req.params.id);

        if(post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }

        await post.remove();

        res.json({ msg: 'Post deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/:id/like
// @desc    Create like
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if(post.likes.findIndex(like => like.user.toString() === req.user.id) !== -1) {
            return res.status(400).json({ msg: 'Post already liked' });
        }

        post.likes.unshift({ user: req.user.id });
        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id/like
// @desc    Delete like
// @access  Private
router.delete('/:id/like', auth, async (req, res) => { 
    try {
        const post = await Post.findById(req.params.id);

        const removeIndex = post.likes.findIndex(like => like.user.toString() === req.user.id);
        if (removeIndex === -1) {
            return res.status(400).json({ msg: 'Post has not yet been liked' });
        }

        post.likes.splice(removeIndex, 1);
        await post.save();

        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/:post_id/comment
// @desc    Create comment
// @access  Private
router.post('/:post_id/comment', [ 
    auth, 
    check('text', 'Text is required').notEmpty()
],
async (req, res) => { 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        text
    } = req.body;

    // Build post object
    const commentFields = {};
    commentFields.user = req.user.id;
    const user = await User.findById(req.user.id);
    commentFields.name = user.name;
    commentFields.avatar = user.avatar;
    if (text) commentFields.text = text;

    try {
        const post = await Post.findById(req.params.post_id);
        post.comments.unshift(commentFields);
        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id/comment/:comment_id
// @desc    Delete comment
// @access  Private
router.delete('/:post_id/comment/:id', auth, async (req, res) => { 
    try {
        const post = await Post.findById(req.params.post_id);
        const removeIndex = post.comments.findIndex(comment => comment.id.toString() === req.params.id);
        if (removeIndex === -1) {
            return res.status(400).json({ msg: 'There is no comment with this id' });
        }

        if (post.comments[removeIndex].user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        
        post.comments.splice(removeIndex, 1);
        await post.save();

        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;