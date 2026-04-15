import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { AttributeValue, AttributeValueProps } from 'src/domain/main/enterprise/entities/attribute-value'
import { faker } from '@faker-js/faker'

export function makeAttributeValue(
  override: Partial<AttributeValueProps> = {},
  id?: UniqueEntityId
) {
  const attributeValue = AttributeValue.create(
    {
      attributeId: new UniqueEntityId().toString(),
      value: faker.lorem.word(),
      ...override,
    },
    id
  )

  return attributeValue
}
