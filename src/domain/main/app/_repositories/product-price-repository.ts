import { ProductPrice } from '../../enterprise/entities/product-price'

export abstract class ProductPriceRepository {
  abstract create(productPrice: ProductPrice): Promise<void>
  abstract findByVariantId(variantId: string): Promise<ProductPrice | null>
  abstract save(productPrice: ProductPrice): Promise<void>
  abstract delete(productPrice: ProductPrice): Promise<void>
}
