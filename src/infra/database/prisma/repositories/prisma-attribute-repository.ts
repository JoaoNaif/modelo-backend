import { Injectable } from '@nestjs/common'
import { AttributeRepository } from 'src/domain/main/app/_repositories/attribute-repository'
import { Attribute } from 'src/domain/main/enterprise/entities/attribute'
import { PrismaAttributeMapper } from '../mappers/prisma-attribute-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAttributeRepository implements AttributeRepository {
  constructor(private prisma: PrismaService) {}

  async create(attribute: Attribute): Promise<void> {
    const data = PrismaAttributeMapper.toPrisma(attribute)

    await this.prisma.attribute.create({
      data,
    })
  }

  async findById(id: string): Promise<Attribute | null> {
    const attribute = await this.prisma.attribute.findUnique({
      where: { id },
    })

    if (!attribute) {
      return null
    }

    return PrismaAttributeMapper.toDomain(attribute)
  }

  async findByName(name: string): Promise<Attribute | null> {
    const attribute = await this.prisma.attribute.findUnique({
      where: { name },
    })

    if (!attribute) {
      return null
    }

    return PrismaAttributeMapper.toDomain(attribute)
  }

  async findAll(): Promise<Attribute[]> {
    const attributes = await this.prisma.attribute.findMany()

    return attributes.map(PrismaAttributeMapper.toDomain)
  }

  async save(attribute: Attribute): Promise<void> {
    const data = PrismaAttributeMapper.toPrisma(attribute)

    await this.prisma.attribute.update({
      where: { id: attribute.id.toString() },
      data,
    })
  }

  async delete(attribute: Attribute): Promise<void> {
    await this.prisma.attribute.delete({
      where: { id: attribute.id.toString() },
    })
  }
}
