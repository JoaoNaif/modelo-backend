import { Injectable } from '@nestjs/common'
import { PrismaProductSectionMapper } from '../mappers/prisma-product-section-mapper'
import { PrismaService } from '../prisma.service'
import { ProductSection } from 'src/domain/main/enterprise/entities/product-section'
import { ProductSectionRepository } from 'src/domain/main/app/_repositories/product-section-repository'

@Injectable()
export class PrismaProductSectionRepository implements ProductSectionRepository {
  constructor(private prisma: PrismaService) {}

  async create(productSection: ProductSection): Promise<void> {
    const data = PrismaProductSectionMapper.toPrisma(productSection)

    await this.prisma.productSection.create({
      data,
    })
  }

  async findById(id: string): Promise<ProductSection | null> {
    const productSection = await this.prisma.productSection.findUnique({
      where: { id },
    })

    if (!productSection) {
      return null
    }

    return PrismaProductSectionMapper.toDomain(productSection)
  }

  async findAllByProductId(productId: string): Promise<ProductSection[]> {
    const productSections = await this.prisma.productSection.findMany({
      where: { productId },
    })

    return productSections.map(PrismaProductSectionMapper.toDomain)
  }

  async save(productSection: ProductSection): Promise<void> {
    const data = PrismaProductSectionMapper.toPrisma(productSection)

    await this.prisma.productSection.update({
      where: { id: productSection.id.toString() },
      data,
    })
  }

  async delete(productSection: ProductSection): Promise<void> {
    await this.prisma.productSection.delete({
      where: { id: productSection.id.toString() },
    })
  }
}
