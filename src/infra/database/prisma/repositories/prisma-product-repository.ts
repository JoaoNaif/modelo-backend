import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ProductRepository } from 'src/domain/main/app/_repositories/product-repository'
import { Product } from 'src/domain/main/enterprise/entities/product'
import { PrismaProductMapper } from '../mappers/prisma-product-mapper'

@Injectable()
export class PrismaProductRepository implements ProductRepository {
  constructor(private prisma: PrismaService) {}

  async create(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.create({
      data,
    })
  }

  async findById(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async findAll(search: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
    })

    return products.map(PrismaProductMapper.toDomain)
  }

  async findByNameAndBrand(
    name: string,
    brandId: string
  ): Promise<Product | null> {
    const product = await this.prisma.product.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
        brandId,
      },
    })

    if (!product) {
      return null
    }

    return PrismaProductMapper.toDomain(product)
  }

  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product)

    await this.prisma.product.update({
      where: { id: product.id.toString() },
      data,
    })
  }

  async delete(product: Product): Promise<void> {
    await this.prisma.product.delete({
      where: { id: product.id.toString() },
    })
  }
}
