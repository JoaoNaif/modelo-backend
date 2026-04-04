import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  ProductPrice,
  ProductPriceProps,
} from 'src/domain/main/enterprise/entities/product-price'

export function makeProductPrice(
  override: Partial<ProductPriceProps> = {},
  id?: UniqueEntityId
) {
  const productPrice = ProductPrice.create(
    {
      variantId: new UniqueEntityId().toString(),
      costPrice: 10,
      originalPrice: 20,
      salePrice: 15,
      installments: 3,
      hasInterest: false,
      ...override,
    },
    id
  )

  return productPrice
}
