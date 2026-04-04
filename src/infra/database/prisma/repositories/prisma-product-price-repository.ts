import { Injectable } from '@nestjs/common'
import { ProductPriceRepository } from 'src/domain/main/app/_repositories/product-price-repository'
import { PrismaService } from '../prisma.service'
import { ProductPrice } from 'src/domain/main/enterprise/entities/product-price'
import { PrismaProductPriceMapper } from '../mappers/prisma-product-price-mapper'

@Injectable()
export class PrismaProductPriceRepository implements ProductPriceRepository {
  constructor(private prisma: PrismaService) {}

  async create(productPrice: ProductPrice): Promise<void> {
    const data = PrismaProductPriceMapper.toPrisma(productPrice)

    await this.prisma.productPrice.create({
      data,
    })
  }

  async findByVariantId(variantId: string): Promise<ProductPrice | null> {
    const productPrice = await this.prisma.productPrice.findUnique({
      where: {
        variantId,
      },
    })

    if (!productPrice) {
      return null
    }

    return PrismaProductPriceMapper.toDomain(productPrice)
  }

  async save(productPrice: ProductPrice): Promise<void> {
    const data = PrismaProductPriceMapper.toPrisma(productPrice)

    await this.prisma.productPrice.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(productPrice: ProductPrice): Promise<void> {
    await this.prisma.productPrice.delete({
      where: {
        id: productPrice.id.toString(),
      },
    })
  }
}
