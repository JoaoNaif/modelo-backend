import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Brand, BrandProps } from 'src/domain/main/enterprise/entities/brand'
import { faker } from '@faker-js/faker'

export function makeBrand(
  override: Partial<BrandProps> = {},
  id?: UniqueEntityId
) {
  const brand = Brand.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id
  )

  return brand
}
