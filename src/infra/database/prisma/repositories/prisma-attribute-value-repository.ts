import { Injectable } from '@nestjs/common'
import {
  AttributeValueRepository,
  AttributeValueWithAttribute,
} from 'src/domain/main/app/_repositories/attribute-value-repository'
import { AttributeValue } from 'src/domain/main/enterprise/entities/attribute-value'
import { PrismaService } from '../prisma.service'
import { PrismaAttributeValueMapper } from '../mappers/prisma-attribute-value-mapper'

@Injectable()
export class PrismaAttributeValueRepository implements AttributeValueRepository {
  constructor(private prisma: PrismaService) {}

  async create(attributeValue: AttributeValue): Promise<void> {
    const data = PrismaAttributeValueMapper.toPrisma(attributeValue)

    await this.prisma.attributeValue.create({
      data,
    })
  }

  async findById(id: string): Promise<AttributeValue | null> {
    const attributeValue = await this.prisma.attributeValue.findUnique({
      where: { id },
    })

    if (!attributeValue) {
      return null
    }

    return PrismaAttributeValueMapper.toDomain(attributeValue)
  }

  async findByAttributeIdAndValue(
    attributeId: string,
    value: string
  ): Promise<AttributeValue | null> {
    const attributeValue = await this.prisma.attributeValue.findUnique({
      where: {
        attributeId_value: {
          attributeId,
          value,
        },
      },
    })

    if (!attributeValue) {
      return null
    }

    return PrismaAttributeValueMapper.toDomain(attributeValue)
  }

  async findAllByAttributeId(attributeId: string): Promise<AttributeValue[]> {
    const attributeValues = await this.prisma.attributeValue.findMany({
      where: { attributeId },
    })

    return attributeValues.map(PrismaAttributeValueMapper.toDomain)
  }

  async findManyWithAttributeByVariantId(
    variantId: string
  ): Promise<AttributeValueWithAttribute[]> {
    const attributeValues = await this.prisma.attributeValue.findMany({
      where: {
        variants: {
          some: {
            id: variantId,
          },
        },
      },
      include: {
        attribute: true,
      },
    })

    return attributeValues.map((av) => ({
      id: av.id,
      attributeId: av.attributeId,
      value: av.value,
      name: av.attribute.name,
    }))
  }

  async save(attributeValue: AttributeValue): Promise<void> {
    const data = PrismaAttributeValueMapper.toPrisma(attributeValue)

    await this.prisma.attributeValue.update({
      where: { id: attributeValue.id.toString() },
      data,
    })
  }

  async delete(attributeValue: AttributeValue): Promise<void> {
    await this.prisma.attributeValue.delete({
      where: { id: attributeValue.id.toString() },
    })
  }
}
