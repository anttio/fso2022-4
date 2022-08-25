const dummy = () => {
  return 1;
};

const favoriteBlog = (blogs) =>
  blogs.reduce((max, current) => (current.likes > max.likes ? current : max));

const mostBlogs = (blogs) => {
  const blogsByAuthor = blogs.reduce((acc, current) => {
    if (!acc[current.author]) {
      acc[current.author] = 1;
    } else {
      acc[current.author]++;
    }
    return acc;
  }, {});

  const authorWithMostBlogs = Object.entries(blogsByAuthor).reduce(
    (acc, current) => (current[1] > acc[1] ? current : acc)
  );

  return {
    author: authorWithMostBlogs[0],
    blogs: authorWithMostBlogs[1],
  };
};

const totalLikes = (blogs) =>
  blogs.reduce((acc, current) => acc + current.likes, 0);

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  totalLikes,
};
