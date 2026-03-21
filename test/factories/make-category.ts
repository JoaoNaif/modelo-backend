import { faker } from '@faker-js/faker/.'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  Category,
  CategoryProps,
} from 'src/domain/main/enterprise/entities/category'

export function makeCategory(
  override: Partial<CategoryProps> = {},
  id?: UniqueEntityId
) {
  const category = Category.create(
    {
      name: faker.lorem.word(),
      parentId: null,
      ...override,
    },
    id
  )
  return category
}
