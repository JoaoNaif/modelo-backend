import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { AttributeRepository } from '../../_repositories/attribute-repository'
import { DtoGetAttributeValue } from '../dtos/dto-get-attribute-value'
import { AttributeValueRepository } from '../../_repositories/attribute-value-repository'

interface FetchAttributeValueUseCaseRequest {
  attributeId: string
}

type FetchAttributeValueUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    attributesValue: DtoGetAttributeValue[]
  }
>

@Injectable()
export class FetchAttributeValueUseCase {
  constructor(private attributeValueRepository: AttributeValueRepository) {}

  async execute({
    attributeId,
  }: FetchAttributeValueUseCaseRequest): Promise<FetchAttributeValueUseCaseResponse> {
    const attributesValue =
      await this.attributeValueRepository.findAllByAttributeId(attributeId)

    return right({
      attributesValue: attributesValue.map((attribute) => ({
        id: attribute.id.toString(),
        attributeId: attribute.attributeId.toString(),
        value: attribute.value,
        createdAt: attribute.createdAt,
        updatedAt: attribute.updatedAt,
      })),
    })
  }
}
