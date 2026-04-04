import { faker } from '@faker-js/faker/.'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  ProductVariant,
  ProductVariantProps,
} from 'src/domain/main/enterprise/entities/product-variant'

export function makeProductVariant(
  override: Partial<ProductVariantProps> = {},
  id?: UniqueEntityId
) {
  const productVariant = ProductVariant.create(
    {
      name: faker.lorem.word(),
      productId: new UniqueEntityId().toString(),
      sku: new UniqueEntityId().toString(),
      ...override,
    },
    id
  )
  return productVariant
}
