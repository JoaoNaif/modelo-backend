import { faker } from '@faker-js/faker/.'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  ProductImage,
  ProductImageProps,
} from 'src/domain/main/enterprise/entities/product-image'

export function makeProductImage(
  override: Partial<ProductImageProps> = {},
  id?: UniqueEntityId
) {
  const productImage = ProductImage.create(
    {
      productId: new UniqueEntityId().toString(),
      variantId: null,
      title: faker.lorem.word(),
      url: faker.internet.url(),
      order: faker.number.int(),
      ...override,
    },
    id
  )
  return productImage
}
