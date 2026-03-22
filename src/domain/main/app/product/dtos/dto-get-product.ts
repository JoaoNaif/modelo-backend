export interface DtoGetProduct {
  id: string
  name: string
  description: string | null
  isActive: boolean
  brandId: string
  categoryId: string | null
  createdAt: Date
  updatedAt?: Date | null
}
