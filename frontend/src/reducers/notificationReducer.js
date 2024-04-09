import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  message: '',
  error: false,
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    changeNotification(state, action) {
      return action.payload
    },
    removeNotification(state, action) {
      state.message = ''
    },
  },
})

export const { changeNotification, removeNotification } = notificationSlice.actions

export const setNotification = (content, error, time) => {
  return async (dispatch) => {
    dispatch(changeNotification({ message: content, error: error }))
    setTimeout(() => {
      dispatch(removeNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer
