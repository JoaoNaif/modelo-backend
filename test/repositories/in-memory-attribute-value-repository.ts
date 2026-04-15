import { AttributeValueRepository } from 'src/domain/main/app/_repositories/attribute-value-repository'
import { AttributeValue } from 'src/domain/main/enterprise/entities/attribute-value'

export class InMemoryAttributeValueRepository implements AttributeValueRepository {
  public items: AttributeValue[] = []

  async create(attributeValue: AttributeValue): Promise<void> {
    this.items.push(attributeValue)
  }

  async findById(id: string): Promise<AttributeValue | null> {
    const attributeValue = this.items.find((item) => item.id.toString() === id)

    if (!attributeValue) {
      return null
    }

    return attributeValue
  }

  async findByAttributeIdAndValue(
    attributeId: string,
    value: string
  ): Promise<AttributeValue | null> {
    const attributeValue = this.items.find(
      (item) => item.attributeId === attributeId && item.value === value
    )

    if (!attributeValue) {
      return null
    }

    return attributeValue
  }

  async findAllByAttributeId(attributeId: string): Promise<AttributeValue[]> {
    return this.items.filter((item) => item.attributeId === attributeId)
  }

  async save(attributeValue: AttributeValue): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === attributeValue.id)

    this.items[itemIndex] = attributeValue
  }

  async delete(attributeValue: AttributeValue): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === attributeValue.id)

    this.items.splice(itemIndex, 1)
  }
}
