import { configureStore } from '@reduxjs/toolkit'
import queueReducer from '../src/queueSlice'

export const store = configureStore({
  reducer: {
    tasks: queueReducer,
  },
})