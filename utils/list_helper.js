const dummy = () => {
  return 1;
};

const totalLikes = (blogs) =>
  blogs.reduce((previous, current) => previous + current.likes, 0);

const favoriteBlog = (blogs) =>
  blogs.reduce((max, current) => (current.likes > max.likes ? current : max));

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
