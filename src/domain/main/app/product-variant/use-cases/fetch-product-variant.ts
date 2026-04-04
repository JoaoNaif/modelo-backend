import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { DtoGetProductVariant } from '../dtos/dto-get-product-variant'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'
import { ProductPriceRepository } from '../../_repositories/product-price-repository'

interface FetchProductVariantUseCaseRequest {
  productId: string
}

type FetchProductVariantUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    productVariants: DtoGetProductVariant[]
  }
>

@Injectable()
export class FetchProductVariantUseCase {
  constructor(
    private productVariantRepository: ProductVariantRepository,
    private productPriceRepository: ProductPriceRepository
  ) {}

  async execute({
    productId,
  }: FetchProductVariantUseCaseRequest): Promise<FetchProductVariantUseCaseResponse> {
    const productVariants =
      await this.productVariantRepository.findAllByProductId(productId)

    const productVariantsWithPrice = await Promise.all(
      productVariants.map(async (productVariant) => {
        const productPrice = await this.productPriceRepository.findByVariantId(
          productVariant.id.toString()
        )

        if (!productPrice) {
          throw new Error(`Price not found for variant ${productVariant.id.toString()}`)
        }

        return {
          id: productVariant.id.toString(),
          name: productVariant.name,
          productId: productVariant.productId,
          sku: productVariant.sku,
          createdAt: productVariant.createdAt,
          updatedAt: productVariant.updatedAt,
          price: {
            id: productPrice.id.toString(),
            variantId: productPrice.variantId,
            costPrice: productPrice.costPrice,
            originalPrice: productPrice.originalPrice,
            salePrice: productPrice.salePrice,
            installments: productPrice.installments,
            hasInterest: productPrice.hasInterest,
            createdAt: productPrice.createdAt,
            updatedAt: productPrice.updatedAt,
          },
        }
      })
    )

    return right({
      productVariants: productVariantsWithPrice,
    })
  }
}
