import { CategoryRepository } from 'src/domain/main/app/_repositories/category-repository'
import { Injectable } from '@nestjs/common'
import { Category } from 'src/domain/main/enterprise/entities/category'
import { PrismaService } from '../prisma.service'
import { PrismaCategoryMapper } from '../mappers/prisma-category.mapper'

@Injectable()
export class PrismaCategoryRepository implements CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async create(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.create({
      data,
    })
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
      },
    })

    if (!category) {
      return null
    }

    return PrismaCategoryMapper.toDomain(category)
  }

  async findAll(search?: string): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: search
        ? {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          }
        : undefined,
    })

    return categories.map(PrismaCategoryMapper.toDomain)
  }

  async save(category: Category): Promise<void> {
    const data = PrismaCategoryMapper.toPrisma(category)

    await this.prisma.category.update({
      where: { id: category.id.toString() },
      data,
    })
  }

  async delete(category: Category): Promise<void> {
    await this.prisma.category.delete({
      where: { id: category.id.toString() },
    })
  }
}
