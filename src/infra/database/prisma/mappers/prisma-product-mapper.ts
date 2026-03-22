import { Prisma, Product as PrismaProduct } from 'generated/prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Product } from 'src/domain/main/enterprise/entities/product'

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct): Product {
    return Product.create(
      {
        name: raw.name,
        description: raw.description,
        isActive: raw.isActive,
        brandId: raw.brandId,
        categoryId: raw.categoryId,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      description: product.description,
      isActive: product.isActive,
      brandId: product.brandId,
      categoryId: product.categoryId,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt ?? undefined,
    }
  }
}
