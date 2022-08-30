const blogsRouter = require('express').Router();
const middleware = require('../utils/middleware');
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  res.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (req, res, next) => {
  const { title, author, url, likes } = req.body;

  try {
    const user = req.user;
    const blog = new Blog({
      title,
      author,
      url,
      likes,
      user: user._id,
    });
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();

    res.json(savedBlog);
  } catch (e) {
    next(e);
  }
});

blogsRouter.put('/:id', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(blog.toJSON());
});

blogsRouter.delete('/:id', middleware.userExtractor, async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    const user = req.user;

    if (blog && user && blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(req.params.id);
      res.status(204).end();
    }
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
