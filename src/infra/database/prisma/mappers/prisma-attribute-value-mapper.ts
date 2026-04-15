import {
  Prisma,
  AttributeValue as PrismaAttributeValue,
} from 'generated/prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { AttributeValue } from 'src/domain/main/enterprise/entities/attribute-value'

export class PrismaAttributeValueMapper {
  static toDomain(raw: any): AttributeValue {
    return AttributeValue.create(
      {
        attributeId: raw.attributeId,
        value: raw.value,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    attributeValue: AttributeValue
  ): Prisma.AttributeValueUncheckedCreateInput {
    return {
      id: attributeValue.id.toString(),
      attributeId: attributeValue.attributeId.toString(),
      value: attributeValue.value,
      createdAt: attributeValue.createdAt,
      updatedAt: attributeValue.updatedAt ?? undefined,
    }
  }
}
