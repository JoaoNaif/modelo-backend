import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'
import { ProductPriceRepository } from '../../_repositories/product-price-repository'
import { DtoAllProductVariant } from '../dtos/dto-all-product-variant'
import { AttributeValueRepository } from '../../_repositories/attribute-value-repository'

interface AllProductVariantUseCaseRequest {
  productId: string
}

type AllProductVariantUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    productVariants: DtoAllProductVariant[]
  }
>

@Injectable()
export class AllProductVariantUseCase {
  constructor(
    private productVariantRepository: ProductVariantRepository,
    private productPriceRepository: ProductPriceRepository,
    private attributeValueRepository: AttributeValueRepository
  ) {}

  async execute({
    productId,
  }: AllProductVariantUseCaseRequest): Promise<AllProductVariantUseCaseResponse> {
    const productVariants =
      await this.productVariantRepository.findAllByProductId(productId)

    const productVariantsWithPrice: DtoAllProductVariant[] = []

    for (const productVariant of productVariants) {
      const productPrice = await this.productPriceRepository.findByVariantId(
        productVariant.id.toString()
      )

      if (!productPrice) {
        return left(new ResourceNotFoundError('ProductPrice'))
      }

      const attributes =
        await this.attributeValueRepository.findManyWithAttributeByVariantId(
          productVariant.id.toString()
        )

      productVariantsWithPrice.push({
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
        attributes: attributes.map((attr) => ({
          id: attr.id,
          value: attr.value,
          attributeId: attr.attributeId,
          name: attr.name,
        })),
      })
    }

    return right({
      productVariants: productVariantsWithPrice,
    })
  }
}
