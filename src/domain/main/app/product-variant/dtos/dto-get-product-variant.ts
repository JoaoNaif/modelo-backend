import { DtoGetProductSection } from '../../product-section/dtos/dto-get-product-section'
import { DtoGetProductPrice } from './dto-get-product-price'

export interface DtoGetProductVariant {
  id: string
  name: string
  sku: string
  productId: string
  createdAt: Date
  updatedAt?: Date | null
  price: DtoGetProductPrice
  section?: DtoGetProductSection
}
