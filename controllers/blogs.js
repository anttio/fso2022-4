const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.json(savedBlog);
  } catch (e) {
    next(e);
  }
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});

module.exports = blogsRouter;
