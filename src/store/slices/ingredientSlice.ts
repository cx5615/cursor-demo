import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Ingredient, IngredientListParams } from '../../types/ingredient'
import { ingredientService } from '../../services/ingredientService'

interface IngredientState {
  items: Ingredient[]
  total: number
  current: number
  pageSize: number
  loading: boolean
  error: string | null
}

const initialState: IngredientState = {
  items: [],
  total: 0,
  current: 1,
  pageSize: 10,
  loading: false,
  error: null,
}

// 异步获取列表
export const fetchIngredients = createAsyncThunk(
  'ingredient/fetchList',
  async (params: IngredientListParams = {}) => {
    const response = await ingredientService.getList(params)
    return response
  }
)

// 异步新增
export const createIngredient = createAsyncThunk(
  'ingredient/create',
  async (data: { name: string; unit: string }) => {
    const response = await ingredientService.create(data)
    return response
  }
)

// 异步更新
export const updateIngredient = createAsyncThunk(
  'ingredient/update',
  async ({ id, data }: { id: number; data: { name: string; unit: string } }) => {
    const response = await ingredientService.update(id, data)
    return response
  }
)

// 异步删除
export const deleteIngredient = createAsyncThunk(
  'ingredient/delete',
  async (id: number) => {
    const response = await ingredientService.delete(id)
    return { id, response }
  }
)

const ingredientSlice = createSlice({
  name: 'ingredient',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // 获取列表
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success) {
          state.items = action.payload.data
          state.total = action.payload.total
          state.current = action.payload.current
          state.pageSize = action.payload.pageSize
        }
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '加载失败'
      })

    // 新增
    builder
      .addCase(createIngredient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createIngredient.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success && action.payload.data) {
          state.items.push(action.payload.data)
          state.total += 1
        }
      })
      .addCase(createIngredient.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '新增失败'
      })

    // 更新
    builder
      .addCase(updateIngredient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateIngredient.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.success && action.payload.data) {
          const index = state.items.findIndex((item) => item.id === action.payload.data.id)
          if (index !== -1) {
            state.items[index] = action.payload.data
          }
        }
      })
      .addCase(updateIngredient.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '更新失败'
      })

    // 删除
    builder
      .addCase(deleteIngredient.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteIngredient.fulfilled, (state, action) => {
        state.loading = false
        if (action.payload.response.success) {
          state.items = state.items.filter((item) => item.id !== action.payload.id)
          state.total -= 1
        }
      })
      .addCase(deleteIngredient.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || '删除失败'
      })
  },
})

export const { clearError } = ingredientSlice.actions
export default ingredientSlice.reducer

