import { ProductPrice } from 'src/domain/main/enterprise/entities/product-price'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import {
  Prisma,
  ProductPrice as PrismaProductPrice,
} from 'generated/prisma/client'

export class PrismaProductPriceMapper {
  static toDomain(raw: PrismaProductPrice): ProductPrice {
    return ProductPrice.create(
      {
        variantId: raw.variantId,
        costPrice: Number(raw.costPrice),
        originalPrice: raw.originalPrice ? Number(raw.originalPrice) : null,
        salePrice: Number(raw.salePrice),
        installments: raw.installments,
        hasInterest: raw.hasInterest,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    productPrice: ProductPrice
  ): Prisma.ProductPriceUncheckedCreateInput {
    return {
      id: productPrice.id.toString(),
      variantId: productPrice.variantId,
      costPrice: new Prisma.Decimal(productPrice.costPrice),
      originalPrice: productPrice.originalPrice
        ? new Prisma.Decimal(productPrice.originalPrice)
        : null,
      salePrice: new Prisma.Decimal(productPrice.salePrice),
      installments: productPrice.installments,
      hasInterest: productPrice.hasInterest,
      createdAt: productPrice.createdAt,
      updatedAt: productPrice.updatedAt ?? undefined,
    }
  }
}
