import { faker } from '@faker-js/faker/.'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  Product,
  ProductProps,
} from 'src/domain/main/enterprise/entities/product'

export function makeProduct(
  override: Partial<ProductProps> = {},
  id?: UniqueEntityId
) {
  const product = Product.create(
    {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      isActive: true,
      brandId: new UniqueEntityId().toString(),
      categoryId: new UniqueEntityId().toString(),
      ...override,
    },
    id
  )
  return product
}
