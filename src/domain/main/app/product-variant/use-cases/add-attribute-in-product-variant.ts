import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { Injectable } from '@nestjs/common'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'
import { ProductPriceRepository } from '../../_repositories/product-price-repository'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { AttributeValueRepository } from '../../_repositories/attribute-value-repository'
import { DtoAllProductVariant } from '../dtos/dto-all-product-variant'

interface AddAttributeInProductVariantUseCaseRequest {
  productVariantId: string
  attributeValueId: string
}

type AddAttributeInProductVariantUseCaseResponse = Either<
  ResourceAlreadyExistError | ResourceNotFoundError,
  {
    productVariant: DtoAllProductVariant
  }
>

@Injectable()
export class AddAttributeInProductVariantUseCase {
  constructor(
    private productVariantRepository: ProductVariantRepository,
    private productPriceRepository: ProductPriceRepository,
    private attributeValueRepository: AttributeValueRepository
  ) {}

  async execute({
    productVariantId,
    attributeValueId,
  }: AddAttributeInProductVariantUseCaseRequest): Promise<AddAttributeInProductVariantUseCaseResponse> {
    const productVariant =
      await this.productVariantRepository.findById(productVariantId)

    if (!productVariant) {
      return left(new ResourceNotFoundError('ProductVariant'))
    }

    const productPrice =
      await this.productPriceRepository.findByVariantId(productVariantId)

    if (!productPrice) {
      return left(new ResourceNotFoundError('ProductPrice'))
    }

    const attributeValue =
      await this.attributeValueRepository.findById(attributeValueId)

    if (!attributeValue) {
      return left(new ResourceNotFoundError('AttributeValue'))
    }

    if (!productVariant.attributeValuesIds) {
      productVariant.attributeValuesIds = []
    }

    if (productVariant.attributeValuesIds.includes(attributeValueId)) {
      return left(
        new ResourceAlreadyExistError(
          `AttributeValue with id ${attributeValueId} already exists in ProductVariant with id ${productVariantId}`
        )
      )
    }

    productVariant.attributeValuesIds.push(attributeValueId)

    await this.productVariantRepository.save(productVariant)

    const attributes =
      await this.attributeValueRepository.findManyWithAttributeByVariantId(
        productVariant.id.toString()
      )

    return right({
      productVariant: {
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
          id: attr.id.toString(),
          value: attr.value,
          attributeId: attr.attributeId,
          name: attr.name,
        })),
      },
    })
  }
}
