import { Injectable } from '@nestjs/common'
import { BrandRepository } from 'src/domain/main/app/_repositories/brand-repository'
import { PrismaService } from '../prisma.service'
import { Brand } from 'src/domain/main/enterprise/entities/brand'
import { PrismaBrandMapper } from '../mappers/prisma-brand-mapper'

@Injectable()
export class PrismaBrandRepository implements BrandRepository {
  constructor(private prisma: PrismaService) {}

  async create(brand: Brand): Promise<void> {
    const data = PrismaBrandMapper.toPrisma(brand)

    await this.prisma.brand.create({
      data,
    })
  }

  async findById(id: string): Promise<Brand | null> {
    const brand = await this.prisma.brand.findUnique({
      where: { id },
    })

    if (!brand) {
      return null
    }

    return PrismaBrandMapper.toDomain(brand)
  }

  async findByName(name: string): Promise<Brand | null> {
    const brand = await this.prisma.brand.findUnique({
      where: { name },
    })

    if (!brand) {
      return null
    }

    return PrismaBrandMapper.toDomain(brand)
  }

  async findAll(): Promise<Brand[]> {
    const brands = await this.prisma.brand.findMany()

    return brands.map(PrismaBrandMapper.toDomain)
  }

  async save(brand: Brand): Promise<void> {
    const data = PrismaBrandMapper.toPrisma(brand)

    await this.prisma.brand.update({
      where: { id: brand.id.toString() },
      data,
    })
  }

  async delete(brand: Brand): Promise<void> {
    await this.prisma.brand.delete({
      where: { id: brand.id.toString() },
    })
  }
}
