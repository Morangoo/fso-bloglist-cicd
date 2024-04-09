import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { setNotification } from './notificationReducer'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const initializeUser = () => {
  return (dispatch) => {
    const loggedBloglistUser = window.localStorage.getItem('loggedBloglistUser')

    if (loggedBloglistUser) {
      const user = JSON.parse(loggedBloglistUser)
      blogService.setToken(user.token)
      dispatch(setUser(user))
    }
  }
}

export const loginUser = (username, password) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login({ username, password })

      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))

      dispatch(setUser(user))
      dispatch(setNotification('Login successful', false, 5))
    } catch (exception) {
      dispatch(setNotification('Wrong username or password', true, 5))
    }
  }
}

export const logoutUser = () => {
  return (dispatch) => {
    blogService.setToken('')
    window.localStorage.removeItem('loggedBloglistUser')
    dispatch(setUser(null))
    dispatch(setNotification('Logout successful', false, 5))
  }
}

export default userSlice.reducer
