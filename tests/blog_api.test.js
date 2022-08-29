const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('blogs have unique identifiers defined', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Testing APIs',
    author: 'Author McAuthorface',
    url: '/testing-apis',
    likes: 12345,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogs = await Blog.find({});
  const blogsAtEnd = blogs.map((blog) => blog.toJSON());
  expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1);
  const title = blogsAtEnd.map((blog) => blog.title);
  expect(title).toContain('Testing APIs');
});

test('blogs have default value on the likes property', async () => {
  const newBlog = {
    title: 'Testing APIs',
    author: 'Author McAuthorface',
    url: '/testing-apis',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogs = await Blog.find({});
  const blogsAtEnd = blogs.map((blog) => blog.toJSON());
  const likes = blogsAtEnd.map((blog) => blog.likes);
  expect(likes[likes.length - 1]).toBe(0);
});

test('blog without title and url are not added', async () => {
  const newBlog = {
    author: 'Author McAuthorface',
    likes: 12345,
  };

  await api.post('/api/blogs').send(newBlog).expect(400);

  const blogs = await Blog.find({});
  const blogsAtEnd = blogs.map((blog) => blog.toJSON());
  expect(blogsAtEnd).toHaveLength(initialBlogs.length);
});

test('a valid blog can be removed', async () => {
  await api.delete('/api/blogs/' + initialBlogs[0]._id);

  const blogs = await Blog.find({});
  const blogsAtEnd = blogs.map((blog) => blog.toJSON());
  expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1);
});

test('a valid blog can be updated', async () => {
  let blogs = await Blog.find({});
  const blogsAtStart = blogs.map((blog) => blog.toJSON());
  const blogToUpdate = blogsAtStart[0];

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: blogToUpdate.likes + 1 })
    .expect(200);

  blogs = await Blog.find({});
  const blogsAtEnd = blogs.map((blog) => blog.toJSON());
  expect(blogsAtEnd[0].likes).toBe(blogToUpdate.likes + 1);
});

afterAll(() => mongoose.connection.close());
