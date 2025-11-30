import { configureStore } from '@reduxjs/toolkit'
import flowReducer from './slices/flowSlice'
import ingredientReducer from './slices/ingredientSlice'

export const store = configureStore({
  reducer: {
    flow: flowReducer,
    ingredient: ingredientReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

