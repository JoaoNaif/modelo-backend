import { ProductVariant } from '../../enterprise/entities/product-variant'

export abstract class ProductVariantRepository {
  abstract create(productVariant: ProductVariant): Promise<void>
  abstract findById(id: string): Promise<ProductVariant | null>
  abstract findAllByProductId(productId: string): Promise<ProductVariant[]>
  abstract findByNameAndProductId(
    name: string,
    productId: string
  ): Promise<ProductVariant | null>
  abstract findBySku(sku: string): Promise<ProductVariant | null>
  abstract save(productVariant: ProductVariant): Promise<void>
  abstract delete(productVariant: ProductVariant): Promise<void>
}
