import {
  IngredientListParams,
  IngredientListResponse,
  IngredientResponse,
  IngredientDeleteResponse,
  IngredientFormData,
} from '../types/ingredient'
import { apiGet, apiPost, apiPut, apiDelete } from '../utils/api'

export const ingredientService = {
  // 获取列表
  getList: async (params: IngredientListParams): Promise<IngredientListResponse> => {
    return apiGet<IngredientListResponse>('/api/ingredients', params)
  },

  // 新增
  create: async (data: IngredientFormData): Promise<IngredientResponse> => {
    return apiPost<IngredientResponse>('/api/ingredients', data)
  },

  // 编辑
  update: async (id: number, data: IngredientFormData): Promise<IngredientResponse> => {
    return apiPut<IngredientResponse>(`/api/ingredients/${id}`, data)
  },

  // 删除
  delete: async (id: number): Promise<IngredientDeleteResponse> => {
    return apiDelete<IngredientDeleteResponse>(`/api/ingredients/${id}`)
  },
}

