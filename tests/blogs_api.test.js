const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const api = supertest(app)
const helper = require('./test_helper')
const bcrypt = require('bcrypt')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secret', 10)
  const user = new User({
    username: 'root',
    name: 'root root',
    passwordHash
  })

  await user.save()

  // Blogs
  await Blog.deleteMany({})

  const blogList = helper.blogs
    .map(blog => {
      blog.user = user._id
      return new Blog(blog)
    })

  const promiseArray = blogList.map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('GET results', () => {
  test('return the current amount of blog posts', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.blogs.length)
  })

  test('unique identifier is id', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
  })
})

describe('adding a new blog', () => {
  test('adding with valid body', async () => {
    const newBlog = {
      'title': 'Titulo',
      'author': 'Joao',
      'url': 'localhost',
      'likes': 35
    }

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.blogs.length + 1)
    expect(blogsAfter.map(b => b.title)).toContain(newBlog.title)
  })

  test('default like property', async () => {
    const newBlog = {
      'title': 'Titulo',
      'author': 'Joao',
      'url': 'localhost'
    }

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    await api.post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${login.body.token}`)

    const blogsAfter = await helper.blogsInDb()
    const updatedBlog = blogsAfter.find(blog => blog.title === newBlog.title)

    expect(updatedBlog.likes).toBe(0)
  })

  test('title or url missing', async () => {
    const newBlogTitle = {
      'author': 'Joao',
      'url': 'localhost'
    }

    const newBlogUrl = {
      'title': 'Titulo',
      'author': 'Joao'
    }

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    await api.post('/api/blogs')
      .send(newBlogTitle)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(400)

    await api.post('/api/blogs')
      .send(newBlogUrl)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(400)
  })

  test('token is not provided', async () => {
    const newBlog = {
      'title': 'Titulo',
      'author': 'Joao',
      'url': 'localhost',
      'likes': 35
    }

    await api.post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('deleting a blog', () => {
  test('deletion with valid ID', async () => {
    const blogsBefore = await helper.blogsInDb()
    const blogDelete = blogsBefore[0]

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    await api
      .delete(`/api/blogs/${blogDelete.id}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(204)

    const blogsAfter = await helper.blogsInDb()

    expect(blogsAfter).toHaveLength(helper.blogs.length - 1)

    const titles = blogsAfter.map(blog => blog.title)
    expect(titles).not.toContain(blogDelete.title)
  })

  test('deletion with invalid ID', async () => {
    const invalidId = await helper.nonExistingId()

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(404)
  })
})

describe('updating a blog', () => {
  test('updating a valid blog', async () => {
    const blogsBefore = await helper.blogsInDb()
    const updateBlog = blogsBefore[0]
    updateBlog.likes = 100

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    await api
      .put(`/api/blogs/${updateBlog.id}`)
      .send(updateBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(200)

    const blogsAfter = await helper.blogsInDb()
    const updatedBlog = blogsAfter[0]

    expect(updatedBlog.likes).toBe(100)
  })

  test('updating with invalid ID', async () => {
    const updateBlog = {
      'title': 'Titulo',
      'author': 'Joao',
      'url': 'localhost'
    }

    const userData = {
      'username': 'root',
      'password': 'secret'
    }

    const login = await api.post('/api/login')
      .send(userData)

    const invalidId = await helper.nonExistingId()

    await api
      .put(`/api/blogs/${invalidId}`).send(updateBlog)
      .set('Authorization', `Bearer ${login.body.token}`)
      .expect(404)
  })
})

describe('creating a new user', () => {
  test('with valid data', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'new',
      name: 'new new',
      password: 'secret'
    }

    await api.
      post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toHaveLength(initialUsers.length + 1)

    const usernames = finalUsers.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('with repeated username', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'new new',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toEqual(initialUsers)
  })

  test('without minlength on username', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'aa',
      name: 'new new',
      password: 'secret'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username')

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toEqual(initialUsers)
  })

  test('without minlength on password', async () => {
    const initialUsers = await helper.usersInDb()

    const newUser = {
      username: 'new',
      name: 'new new',
      password: 'aa'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password must have 3')

    const finalUsers = await helper.usersInDb()
    expect(finalUsers).toEqual(initialUsers)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})