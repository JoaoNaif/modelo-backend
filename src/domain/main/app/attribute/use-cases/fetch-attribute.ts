import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { DtoGetAttribute } from '../dtos/dto-get-attribute'
import { AttributeRepository } from '../../_repositories/attribute-repository'

interface FetchAttributeUseCaseRequest {
  search: string
}

type FetchAttributeUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    attributes: DtoGetAttribute[]
  }
>

@Injectable()
export class FetchAttributeUseCase {
  constructor(private attributeRepository: AttributeRepository) {}

  async execute({
    search,
  }: FetchAttributeUseCaseRequest): Promise<FetchAttributeUseCaseResponse> {
    const attributes = await this.attributeRepository.findAll(search)

    return right({
      attributes: attributes.map((attribute) => ({
        id: attribute.id.toString(),
        name: attribute.name,
        createdAt: attribute.createdAt,
        updatedAt: attribute.updatedAt,
      })),
    })
  }
}
