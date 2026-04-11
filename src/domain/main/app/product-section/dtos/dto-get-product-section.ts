import { ProductSectionType } from 'src/domain/main/enterprise/entities/product-section'

export interface DtoGetProductSection {
  id: string
  productId: string
  title: string
  content: string
  type: ProductSectionType
  createdAt: Date
  updatedAt?: Date | null
}
