import { Injectable } from '@nestjs/common'
import { ProductVariantRepository } from 'src/domain/main/app/_repositories/product-variant-repository'
import { ProductVariant } from 'src/domain/main/enterprise/entities/product-variant'
import { PrismaService } from '../prisma.service'
import { PrismaProductVariantMapper } from '../mappers/prisma-product-variant-mapper'

@Injectable()
export class PrismaProductVariantRepository implements ProductVariantRepository {
  constructor(private prisma: PrismaService) {}

  async create(productVariant: ProductVariant): Promise<void> {
    const data = PrismaProductVariantMapper.toPrisma(productVariant)

    await this.prisma.productVariant.create({
      data,
    })
  }

  async findById(id: string): Promise<ProductVariant | null> {
    const productVariant = await this.prisma.productVariant.findUnique({
      where: { id },
    })

    if (!productVariant) {
      return null
    }

    return PrismaProductVariantMapper.toDomain(productVariant)
  }

  async findAllByProductId(productId: string): Promise<ProductVariant[]> {
    const productVariants = await this.prisma.productVariant.findMany({
      where: { productId },
    })

    return productVariants.map(PrismaProductVariantMapper.toDomain)
  }

  async findByNameAndProductId(
    name: string,
    productId: string
  ): Promise<ProductVariant | null> {
    const productVariant = await this.prisma.productVariant.findFirst({
      where: { name, productId },
    })

    if (!productVariant) {
      return null
    }

    return PrismaProductVariantMapper.toDomain(productVariant)
  }

  async findBySku(sku: string): Promise<ProductVariant | null> {
    const productVariant = await this.prisma.productVariant.findFirst({
      where: { sku },
    })

    if (!productVariant) {
      return null
    }

    return PrismaProductVariantMapper.toDomain(productVariant)
  }

  async save(productVariant: ProductVariant): Promise<void> {
    const data = PrismaProductVariantMapper.toPrisma(productVariant)

    await this.prisma.productVariant.update({
      where: { id: productVariant.id.toString() },
      data,
    })
  }

  async delete(productVariant: ProductVariant): Promise<void> {
    await this.prisma.productVariant.delete({
      where: { id: productVariant.id.toString() },
    })
  }
}
