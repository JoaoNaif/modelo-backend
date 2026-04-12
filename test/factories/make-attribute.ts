import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Attribute, AttributeProps } from 'src/domain/main/enterprise/entities/attribute'
import { faker } from '@faker-js/faker'

export function makeAttribute(
  override: Partial<AttributeProps> = {},
  id?: UniqueEntityId
) {
  const attribute = Attribute.create(
    {
      name: faker.lorem.word(),
      ...override,
    },
    id
  )

  return attribute
}
