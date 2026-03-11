import { Prisma, Brand as PrismaBrand } from 'generated/prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Brand } from 'src/domain/main/enterprise/entities/brand'

export class PrismaBrandMapper {
  static toDomain(raw: PrismaBrand): Brand {
    return Brand.create(
      {
        name: raw.name,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(brand: Brand): Prisma.BrandUncheckedCreateInput {
    return {
      id: brand.id.toString(),
      name: brand.name,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt ?? undefined,
    }
  }
}
