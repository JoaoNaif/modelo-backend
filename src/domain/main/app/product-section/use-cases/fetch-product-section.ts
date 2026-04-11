import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { DtoGetProductSection } from '../dtos/dto-get-product-section'
import { ProductSectionRepository } from '../../_repositories/product-section-repository'
import { ProductRepository } from '../../_repositories/product-repository'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'

interface FetchProductSectionUseCaseRequest {
  productId: string
}

type FetchProductSectionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    productSections: DtoGetProductSection[]
  }
>

@Injectable()
export class FetchProductSectionUseCase {
  constructor(
    private productSectionRepository: ProductSectionRepository,
    private productRepository: ProductRepository
  ) {}

  async execute({
    productId,
  }: FetchProductSectionUseCaseRequest): Promise<FetchProductSectionUseCaseResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError('Product not found'))
    }

    const productSections =
      await this.productSectionRepository.findAllByProductId(productId)

    return right({
      productSections: productSections.map((productSection) => {
        return {
          id: productSection.id.toString(),
          productId: productSection.productId,
          title: productSection.title,
          content: productSection.content,
          type: productSection.type,
          createdAt: productSection.createdAt,
          updatedAt: productSection.updatedAt,
        }
      }),
    })
  }
}
