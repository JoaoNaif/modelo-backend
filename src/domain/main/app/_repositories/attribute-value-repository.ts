import { AttributeValue } from '../../enterprise/entities/attribute-value'

export interface AttributeValueWithAttribute {
  id: string
  attributeId: string
  value: string
  name: string
}

export abstract class AttributeValueRepository {
  abstract create(attributeValue: AttributeValue): Promise<void>
  abstract findById(id: string): Promise<AttributeValue | null>
  abstract findByAttributeIdAndValue(
    attributeId: string,
    value: string
  ): Promise<AttributeValue | null>
  abstract findAllByAttributeId(attributeId: string): Promise<AttributeValue[]>
  abstract findManyWithAttributeByVariantId(
    variantId: string
  ): Promise<AttributeValueWithAttribute[]>
  abstract save(attributeValue: AttributeValue): Promise<void>
  abstract delete(attributeValue: AttributeValue): Promise<void>
}
