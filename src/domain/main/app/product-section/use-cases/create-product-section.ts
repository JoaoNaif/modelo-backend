import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { Injectable } from '@nestjs/common'
import { ProductRepository } from '../../_repositories/product-repository'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import {
  ProductSection,
  ProductSectionType,
} from 'src/domain/main/enterprise/entities/product-section'
import { DtoGetProductSection } from '../dtos/dto-get-product-section'
import { ProductSectionRepository } from '../../_repositories/product-section-repository'

interface CreateProductSectionUseCaseRequest {
  productId: string
  title: string
  content: string
  type: ProductSectionType
}

type CreateProductSectionUseCaseResponse = Either<
  ResourceAlreadyExistError | ResourceNotFoundError,
  {
    productSection: DtoGetProductSection
  }
>

@Injectable()
export class CreateProductSectionUseCase {
  constructor(
    private productSectionRepository: ProductSectionRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    productId,
    title,
    content,
    type,
  }: CreateProductSectionUseCaseRequest): Promise<CreateProductSectionUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError('Product'))
    }

    const productSectionAlreadyExists =
      await this.productSectionRepository.findAllByProductId(productId)

    if (productSectionAlreadyExists.length > 0) {
      return left(new ResourceAlreadyExistError('ProductSection'))
    }

    const productSection = ProductSection.create({
      productId,
      title,
      content,
      type,
    })

    await this.productSectionRepository.create(productSection)

    return right({
      productSection: {
        id: productSection.id.toString(),
        productId: productSection.productId,
        title: productSection.title,
        content: productSection.content,
        type: productSection.type,
        createdAt: productSection.createdAt,
        updatedAt: productSection.updatedAt,
      },
    })
  }
}
