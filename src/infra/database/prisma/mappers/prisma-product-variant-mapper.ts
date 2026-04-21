import {
  Prisma,
  ProductVariant as PrismaProductVariant,
} from 'generated/prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { ProductVariant } from 'src/domain/main/enterprise/entities/product-variant'

export class PrismaProductVariantMapper {
  static toDomain(raw: any): ProductVariant {
    return ProductVariant.create(
      {
        name: raw.name,
        sku: raw.sku,
        productId: raw.productId,
        attributeValuesIds: raw.attributeValues?.map((av: any) =>
          av.id.toString()
        ),
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    productVariant: ProductVariant
  ): Prisma.ProductVariantUncheckedCreateInput {
    return {
      id: productVariant.id.toString(),
      name: productVariant.name,
      sku: productVariant.sku,
      productId: productVariant.productId,
      createdAt: productVariant.createdAt,
      updatedAt: productVariant.updatedAt ?? undefined,
    }
  }
}
