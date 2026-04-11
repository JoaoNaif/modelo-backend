import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  Prisma,
  ProductSection as PrismaProductSection,
} from 'generated/prisma/client'
import {
  ProductSection,
  ProductSectionType,
} from 'src/domain/main/enterprise/entities/product-section'

export class PrismaProductSectionMapper {
  static toDomain(raw: PrismaProductSection): ProductSection {
    return ProductSection.create(
      {
        productId: raw.productId,
        type: raw.type as ProductSectionType,
        title: raw.title,
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    productSection: ProductSection
  ): Prisma.ProductSectionUncheckedCreateInput {
    return {
      id: productSection.id.toString(),
      productId: productSection.productId,
      type: productSection.type as ProductSectionType,
      title: productSection.title,
      content: productSection.content,
      createdAt: productSection.createdAt,
      updatedAt: productSection.updatedAt ?? undefined,
    }
  }
}
