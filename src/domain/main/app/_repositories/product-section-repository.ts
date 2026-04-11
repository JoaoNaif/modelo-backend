import { ProductSection } from '../../enterprise/entities/product-section'

export abstract class ProductSectionRepository {
  abstract create(productSection: ProductSection): Promise<void>
  abstract findById(id: string): Promise<ProductSection | null>
  abstract findAllByProductId(productId: string): Promise<ProductSection[]>
  abstract save(productSection: ProductSection): Promise<void>
  abstract delete(productSection: ProductSection): Promise<void>
}
