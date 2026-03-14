import { Injectable } from '@nestjs/common'
import { BrandRepository } from '../../_repositories/brand-repository'
import { Brand } from 'src/domain/main/enterprise/entities/brand'
import { Either, left, right } from 'src/core/either'
import { BrandNotExistsError } from '../errors/brand-not-exist-error'
import { DtoGetBrand } from '../dtos/dto-brand-user'

interface GetBrandUseCaseRequest {
  id: string
}

type GetBrandUseCaseResponse = Either<
  BrandNotExistsError,
  {
    brand: DtoGetBrand
  }
>

@Injectable()
export class GetBrandUseCase {
  constructor(private brandRepository: BrandRepository) {}

  async execute({
    id,
  }: GetBrandUseCaseRequest): Promise<GetBrandUseCaseResponse> {
    const brand = await this.brandRepository.findById(id)

    if (!brand) {
      return left(new BrandNotExistsError())
    }

    return right({
      brand: {
        id: brand.id.toString(),
        name: brand.name,
        createdAt: brand.createdAt,
        updatedAt: brand.updatedAt,
      },
    })
  }
}
