import { AttributeValue } from '../../enterprise/entities/attribute-value'

export abstract class AttributeValueRepository {
  abstract create(attributeValue: AttributeValue): Promise<void>
  abstract findById(id: string): Promise<AttributeValue | null>
  abstract findByAttributeIdAndValue(
    attributeId: string,
    value: string
  ): Promise<AttributeValue | null>
  abstract findAllByAttributeId(attributeId: string): Promise<AttributeValue[]>
  abstract save(attributeValue: AttributeValue): Promise<void>
  abstract delete(attributeValue: AttributeValue): Promise<void>
}
