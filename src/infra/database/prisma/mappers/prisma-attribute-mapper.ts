import { Prisma, Attribute as PrismaAttribute } from 'generated/prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Attribute } from 'src/domain/main/enterprise/entities/attribute'

export class PrismaAttributeMapper {
  static toDomain(raw: PrismaAttribute): Attribute {
    return Attribute.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(attribute: Attribute): Prisma.AttributeUncheckedCreateInput {
    return {
      id: attribute.id.toString(),
      name: attribute.name,
      createdAt: attribute.createdAt,
      updatedAt: attribute.updatedAt ?? undefined,
    }
  }
}
