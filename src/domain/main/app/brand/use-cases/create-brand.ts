import { Injectable } from '@nestjs/common'
import { BrandRepository } from '../../_repositories/brand-repository'
import { Brand } from 'src/domain/main/enterprise/entities/brand'
import { Either, left, right } from 'src/core/either'
import { BrandAlreadyExistError } from '../errors/brand-already-exist-error'

interface CreateBrandUseCaseRequest {
  name: string
}

type CreateBrandUseCaseResponse = Either<
  BrandAlreadyExistError,
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
      return left(new BrandAlreadyExistError(name))
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
