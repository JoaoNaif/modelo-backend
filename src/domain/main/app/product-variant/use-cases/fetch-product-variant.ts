import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { DtoGetProductVariant } from '../dtos/dto-get-product-variant'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'

interface FetchProductVariantUseCaseRequest {
  productId: string
}

type FetchProductVariantUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    productVariants: DtoGetProductVariant[]
  }
>

@Injectable()
export class FetchProductVariantUseCase {
  constructor(private productVariantRepository: ProductVariantRepository) {}

  async execute({
    productId,
  }: FetchProductVariantUseCaseRequest): Promise<FetchProductVariantUseCaseResponse> {
    const productVariants =
      await this.productVariantRepository.findAllByProductId(productId)

    return right({
      productVariants: productVariants.map((productVariant) => ({
        id: productVariant.id.toString(),
        name: productVariant.name,
        productId: productVariant.productId,
        sku: productVariant.sku,
        createdAt: productVariant.createdAt,
        updatedAt: productVariant.updatedAt,
      })),
    })
  }
}
