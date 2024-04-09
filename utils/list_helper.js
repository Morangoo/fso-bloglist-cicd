const _ = require('lodash')

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const total = blogs.reduce((sum, curr) => {
    return sum + curr.likes
  }, 0)

  return total
}

const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((max, obg) => {
    return obg.likes > max.likes ? obg : max
  })

  delete blog._id
  delete blog.__v
  delete blog.url
  return blog
}

const mostBlogs = (blogs) => {
  const result = _.countBy(blogs, 'author')
  const authorName = Object.keys(result).reduce((a, b) => result[a] > result[b] ? a : b)

  return {
    author: authorName,
    blogs: result[authorName]
  }
}

const mostLikes = (blogs) => {
  const authors = _.groupBy(blogs, 'author')

  const result = _.map(authors, (entries, author) => ({
    author,
    likes: _.sumBy(entries, 'likes')
  }))

  return _.maxBy(result, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}