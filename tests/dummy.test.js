const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when list has more blogs', () => {
    const result = listHelper.totalLikes(helper.blogs)
    expect(result).toBe(36)
  })
})

describe('most likes', () => {
  test('blog with most likes', () => {
    const result = listHelper.favoriteBlog(helper.blogs)

    const expected = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    }

    expect(result).toEqual(expected)
  })
})

describe('most blogs', () => {
  test('author that has most blogs', () => {
    const result = listHelper.mostBlogs(helper.blogs)

    const expected = {
      author: "Robert C. Martin",
      blogs: 3
    }

    expect(result).toEqual(expected)
  })
})

describe('most likes', () => {
  test('author that has most likes', () => {
    const result = listHelper.mostLikes(helper.blogs)

    const expected = {
      author: "Edsger W. Dijkstra",
      likes: 17
    }

    expect(result).toEqual(expected)
  })
})