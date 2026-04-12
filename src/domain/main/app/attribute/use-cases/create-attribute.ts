import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { AttributeRepository } from '../../_repositories/attribute-repository'
import { Attribute } from '../../../enterprise/entities/attribute'
import { DtoGetAttribute } from '../dtos/dto-get-attribute'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

interface CreateAttributeUseCaseRequest {
  name: string
}

type CreateAttributeUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    attribute: DtoGetAttribute
  }
>

@Injectable()
export class CreateAttributeUseCase {
  constructor(private attributeRepository: AttributeRepository) {}

  async execute({
    name,
  }: CreateAttributeUseCaseRequest): Promise<CreateAttributeUseCaseResponse> {
    const attributeWithSameName = await this.attributeRepository.findByName(name)

    if (attributeWithSameName) {
      return left(new ResourceAlreadyExistError('Attribute'))
    }

    const attribute = Attribute.create({
      name,
    })

    await this.attributeRepository.create(attribute)

    return right({
      attribute: {
        id: attribute.id.toString(),
        name: attribute.name,
        createdAt: attribute.createdAt,
        updatedAt: attribute.updatedAt,
      },
    })
  }
}
