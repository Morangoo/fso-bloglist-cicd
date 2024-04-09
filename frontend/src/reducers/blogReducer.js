import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload)
    },
    addLike(state, action) {
      return state.map((blog) => {
        if (blog.id === action.payload) {
          return {
            ...blog,
            likes: blog.likes + 1,
          }
        } else {
          return blog
        }
      })
    },
    addComment(state, action) {
      return state.map((blog) => {
        if (blog.id === action.payload.id) {
          return {
            ...blog,
            comments: [...blog.comments, action.payload.comment],
          }
        } else {
          return blog
        }
      })
    },
  },
})

export const { setBlogs, appendBlog, removeBlog, addLike, addComment } = blogSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const create = (content, username) => {
  return async (dispatch) => {
    try {
      const blog = await blogService.addBlog(content)
      blog.user = {}
      blog.user.username = username

      dispatch(appendBlog(blog))
      dispatch(setNotification(`a new blog ${content.title} by ${content.author} added`, false, 5))
    } catch (exception) {
      dispatch(setNotification('Error adding a new blog', true, 5))
    }
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    blogService.deleteBlog(id)
    dispatch(removeBlog(id))
  }
}

export const addLikeBlog = (blog) => {
  return async (dispatch) => {
    const updatedBlog = await blogService.updateBlog({
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    })

    dispatch(addLike(updatedBlog.id))
  }
}

export const addCommentBlog = (id, comment) => {
  return async (dispatch) => {
    await blogService.addComment(id, { comment })

    dispatch(addComment({ id, comment }))
  }
}

export default blogSlice.reducer
