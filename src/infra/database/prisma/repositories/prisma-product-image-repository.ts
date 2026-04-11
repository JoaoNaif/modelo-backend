import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ProductImageRepository } from 'src/domain/main/app/_repositories/product-image-repository'
import { ProductImage } from 'src/domain/main/enterprise/entities/product-image'
import { PrismaProductImageMapper } from '../mappers/prisma-product-image-mapper'

@Injectable()
export class PrismaProductImageRepository implements ProductImageRepository {
  constructor(private prisma: PrismaService) {}

  async create(productImage: ProductImage): Promise<void> {
    const data = PrismaProductImageMapper.toPrisma(productImage)

    await this.prisma.productImage.create({
      data,
    })
  }

  async findById(id: string): Promise<ProductImage | null> {
    const productImage = await this.prisma.productImage.findUnique({
      where: { id },
    })

    if (!productImage) {
      return null
    }

    return PrismaProductImageMapper.toDomain(productImage)
  }

  async findAllByProductId(productId: string): Promise<ProductImage[]> {
    const productImages = await this.prisma.productImage.findMany({
      where: {
        productId,
      },
    })

    return productImages.map(PrismaProductImageMapper.toDomain)
  }

  async save(productImage: ProductImage): Promise<void> {
    const data = PrismaProductImageMapper.toPrisma(productImage)

    await this.prisma.productImage.update({
      where: { id: productImage.id.toString() },
      data,
    })
  }

  async delete(productImage: ProductImage): Promise<void> {
    await this.prisma.productImage.delete({
      where: { id: productImage.id.toString() },
    })
  }
}
