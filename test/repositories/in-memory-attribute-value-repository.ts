import {
  AttributeValueRepository,
  AttributeValueWithAttribute,
} from 'src/domain/main/app/_repositories/attribute-value-repository'
import { AttributeValue } from 'src/domain/main/enterprise/entities/attribute-value'
import { InMemoryAttributeRepository } from './in-memory-attribute-repository'

export class InMemoryAttributeValueRepository implements AttributeValueRepository {
  public items: AttributeValue[] = []
  public variantAttributeValues: { variantId: string; attributeValueId: string }[] =
    []

  constructor(private attributeRepository: InMemoryAttributeRepository) {}

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

  async findManyWithAttributeByVariantId(
    variantId: string
  ): Promise<AttributeValueWithAttribute[]> {
    const attributeValueIds = this.variantAttributeValues
      .filter((vav) => vav.variantId === variantId)
      .map((vav) => vav.attributeValueId)

    const attributeValues = this.items.filter((item) =>
      attributeValueIds.includes(item.id.toString())
    )

    const result: AttributeValueWithAttribute[] = []

    for (const av of attributeValues) {
      const attribute = this.attributeRepository.items.find(
        (a) => a.id.toString() === av.attributeId
      )

      if (attribute) {
        result.push({
          id: av.id.toString(),
          attributeId: av.attributeId,
          value: av.value,
          name: attribute.name,
        })
      }
    }

    return result
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
