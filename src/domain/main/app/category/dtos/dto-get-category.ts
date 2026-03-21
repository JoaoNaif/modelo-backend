export interface DtoGetCategory {
  id: string
  name: string
  parentId?: string | null
  createdAt: Date
  updatedAt?: Date | null
}
