import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { Injectable } from '@nestjs/common'
import { Product } from 'src/domain/main/enterprise/entities/product'
import { DtoGetProductVariant } from '../dtos/dto-get-product-variant'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'
import { ProductVariant } from 'src/domain/main/enterprise/entities/product-variant'
import { ProductRepository } from '../../_repositories/product-repository'

interface CreateProductVariantUseCaseRequest {
  name: string
  productId: string
  sku: string
}

type CreateProductVariantUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    productVariant: DtoGetProductVariant
  }
>

@Injectable()
export class CreateProductVariantUseCase {
  constructor(
    private productVariantRepository: ProductVariantRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    name,
    sku,
    productId,
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
      return left(new ResourceAlreadyExistError(productId))
    }

    const productVariant = ProductVariant.create({
      name,
      productId,
      sku,
    })

    await this.productVariantRepository.create(productVariant)

    return right({
      productVariant: {
        id: productVariant.id.toString(),
        name: productVariant.name,
        productId: productVariant.productId,
        sku: productVariant.sku,
        createdAt: productVariant.createdAt,
        updatedAt: productVariant.updatedAt,
      },
    })
  }
}
