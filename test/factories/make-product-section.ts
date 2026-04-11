import { faker } from '@faker-js/faker'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  ProductSection,
  ProductSectionProps,
  ProductSectionType,
} from 'src/domain/main/enterprise/entities/product-section'

export function makeProductSection(
  override: Partial<ProductSectionProps> = {},
  id?: UniqueEntityId
) {
  const productSection = ProductSection.create(
    {
      productId: new UniqueEntityId().toString(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraphs(),
      type: ProductSectionType.BENEFITS,
      ...override,
    },
    id
  )
  return productSection
}
