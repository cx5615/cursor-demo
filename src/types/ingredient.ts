export interface Ingredient {
  id: number
  name: string
  unit: string
  createdAt: string
  updatedAt: string
}

export interface IngredientListParams {
  current?: number
  pageSize?: number
  search?: string
}

export interface IngredientListResponse {
  success: boolean
  data: Ingredient[]
  total: number
  current: number
  pageSize: number
}

export interface IngredientResponse {
  success: boolean
  data: Ingredient
  message?: string
}

export interface IngredientDeleteResponse {
  success: boolean
  message?: string
}

export interface IngredientFormData {
  name: string
  unit: string
}

