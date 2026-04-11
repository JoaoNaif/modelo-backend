import {
  Prisma,
  ProductImage as PrismaProductImage,
} from 'generated/prisma/client'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { ProductImage } from 'src/domain/main/enterprise/entities/product-image'

export class PrismaProductImageMapper {
  static toDomain(raw: PrismaProductImage): ProductImage {
    return ProductImage.create(
      {
        productId: raw.productId,
        variantId: raw.variantId,
        url: raw.url,
        order: raw.order,
        title: raw.title,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(
    productImage: ProductImage
  ): Prisma.ProductImageUncheckedCreateInput {
    return {
      id: productImage.id.toString(),
      productId: productImage.productId,
      variantId: productImage.variantId,
      url: productImage.url,
      order: productImage.order,
      title: productImage.title,
      createdAt: productImage.createdAt,
    }
  }
}
