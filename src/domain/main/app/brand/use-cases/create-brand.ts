import { Injectable } from '@nestjs/common'
import { BrandRepository } from '../../_repositories/brand-repository'
import { Brand } from 'src/domain/main/enterprise/entities/brand'
import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

interface CreateBrandUseCaseRequest {
  name: string
}

type CreateBrandUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    brand: Brand
  }
>

@Injectable()
export class CreateBrandUseCase {
  constructor(private brandRepository: BrandRepository) {}

  async execute({
    name,
  }: CreateBrandUseCaseRequest): Promise<CreateBrandUseCaseResponse> {
    const brandAlreadyExists = await this.brandRepository.findByName(name)

    if (brandAlreadyExists) {
      return left(new ResourceAlreadyExistError(name))
    }

    const brand = Brand.create({
      name,
    })

    await this.brandRepository.create(brand)

    return right({
      brand,
    })
  }
}
