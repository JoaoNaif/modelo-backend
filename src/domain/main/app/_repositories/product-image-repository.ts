import { ProductImage } from '../../enterprise/entities/product-image'

export abstract class ProductImageRepository {
  abstract create(productImage: ProductImage): Promise<void>
  abstract findById(id: string): Promise<ProductImage | null>
  abstract findAllByProductId(productId: string): Promise<ProductImage[]>
  abstract save(productImage: ProductImage): Promise<void>
  abstract delete(productImage: ProductImage): Promise<void>
}
