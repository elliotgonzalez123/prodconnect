const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/User');

// @route POST api/posts
// @desc create a post
// @access private

router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route GET api/posts
// @desc get all posts
// @access private

router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route GET api/posts/:id
// @desc get all posts by user
// @access private

router.get('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    res.json(post);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'post not found' });
    }
    res.status(500).send('server error');
  }
});

// @route DELETE api/posts/:id
// @desc delete by post id
// @access private

router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'post not found' });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'user not authorized' });
    } else {
      await post.remove();
      res.json({ message: 'post removed' });
    }
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'post not found' });
    }
    res.status(500).send('server error');
  }
});

// @route PUT api/posts/like/:id
// @desc add a like by post id
// @access private

router.put('/like/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has been liked by user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ message: 'post already liked' });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route PUT api/posts/like/:id
// @desc unlike by post id
// @access private

router.put('/unlike/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    //check if post has been liked by user
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length ===
      0
    ) {
      return res.status(400).json({ message: 'post has not yet been liked' });
    }
    //get remove index
    const removeIndex = post.likes.map(like => {
      return like.user.toString().indexOf(req.user.id);
    });

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

// @route POST api/posts/comments/:id
// @desc comment on a post
// @access private

router.post(
  '/comment/:id',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ erros: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route DELETE api/posts/comment/:id/:comment_id
// @desc delete a comment on a post
// @access private

router.delete('/comment/:id/:comment_id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    //pull out comment
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ message: 'comment not found' });
    }
    // check user made comment
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'user not authorized' });
    }

    const removeIndex = post.comments.map(comment => {
      return comment.user.toString().indexOf(req.user.id);
    });

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
});

module.exports = router;
