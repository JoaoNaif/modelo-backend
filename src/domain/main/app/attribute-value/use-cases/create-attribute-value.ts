import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { AttributeRepository } from '../../_repositories/attribute-repository'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { DtoGetAttributeValue } from '../dtos/dto-get-attribute-value'
import { AttributeValueRepository } from '../../_repositories/attribute-value-repository'
import { AttributeValue } from 'src/domain/main/enterprise/entities/attribute-value'

interface CreateAttributeValueUseCaseRequest {
  value: string
  attributeId: string
}

type CreateAttributeValueUseCaseResponse = Either<
  ResourceAlreadyExistError | ResourceNotFoundError,
  {
    attributeValue: DtoGetAttributeValue
  }
>

@Injectable()
export class CreateAttributeValueUseCase {
  constructor(
    private attributeRepository: AttributeRepository,
    private attributeValueRepository: AttributeValueRepository
  ) {}

  async execute({
    value,
    attributeId,
  }: CreateAttributeValueUseCaseRequest): Promise<CreateAttributeValueUseCaseResponse> {
    const attribute = await this.attributeRepository.findById(attributeId)

    if (!attribute) {
      return left(new ResourceNotFoundError('Attribute'))
    }

    const attributeValueWithSameValue =
      await this.attributeValueRepository.findByAttributeIdAndValue(
        attributeId,
        value
      )

    if (attributeValueWithSameValue) {
      return left(new ResourceAlreadyExistError('Attribute Value'))
    }

    const attributeValue = AttributeValue.create({
      attributeId,
      value,
    })

    await this.attributeValueRepository.create(attributeValue)

    return right({
      attributeValue: {
        id: attributeValue.id.toString(),
        attributeId: attributeValue.attributeId.toString(),
        value: attributeValue.value,
        createdAt: attributeValue.createdAt,
        updatedAt: attributeValue.updatedAt,
      },
    })
  }
}
