import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { Injectable } from '@nestjs/common'
import { DtoGetProductVariant } from '../dtos/dto-get-product-variant'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'
import { ProductVariant } from 'src/domain/main/enterprise/entities/product-variant'
import { ProductRepository } from '../../_repositories/product-repository'
import { ProductPrice } from 'src/domain/main/enterprise/entities/product-price'
import { ProductPriceRepository } from '../../_repositories/product-price-repository'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'

interface CreateProductVariantUseCaseRequest {
  name: string
  productId: string
  sku: string
  costPrice: number
  originalPrice: number | null
  salePrice: number
  installments: number | null
  hasInterest?: boolean
  attributeValuesIds?: string[]
}

type CreateProductVariantUseCaseResponse = Either<
  ResourceAlreadyExistError | ResourceNotFoundError,
  {
    productVariant: DtoGetProductVariant
  }
>

@Injectable()
export class CreateProductVariantUseCase {
  constructor(
    private productVariantRepository: ProductVariantRepository,
    private productRepository: ProductRepository,
    private productPriceRepository: ProductPriceRepository
  ) {}

  async execute({
    name,
    sku,
    productId,
    costPrice,
    originalPrice,
    salePrice,
    installments,
    hasInterest,
    attributeValuesIds,
  }: CreateProductVariantUseCaseRequest): Promise<CreateProductVariantUseCaseResponse> {
    const skuAlreadyExists = await this.productVariantRepository.findBySku(sku)

    if (skuAlreadyExists) {
      return left(new ResourceAlreadyExistError(sku))
    }

    const nameAndProductIdAlreadyExists =
      await this.productVariantRepository.findByNameAndProductId(
        name,
        productId
      )

    if (nameAndProductIdAlreadyExists) {
      return left(new ResourceAlreadyExistError(name))
    }

    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError(productId))
    }

    const productVariant = ProductVariant.create({
      name,
      productId,
      sku,
      attributeValuesIds,
    })

    await this.productVariantRepository.create(productVariant)

    const productPrice = ProductPrice.create({
      variantId: productVariant.id.toString(),
      costPrice,
      originalPrice,
      salePrice,
      installments,
      hasInterest: hasInterest ?? false,
    })
    await this.productPriceRepository.create(productPrice)

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
      },
    })
  }
}
