import { Injectable } from '@nestjs/common'
import { Either, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { DtoGetProduct } from '../dtos/dto-get-product'
import { ProductRepository } from '../../_repositories/product-repository'

interface FetchProductUseCaseRequest {
  search: string
}

type FetchProductUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    products: DtoGetProduct[]
  }
>

@Injectable()
export class FetchProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    search,
  }: FetchProductUseCaseRequest): Promise<FetchProductUseCaseResponse> {
    const products = await this.productRepository.findAll(search)

    return right({
      products: products.map((product) => ({
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        isActive: product.isActive,
        brandId: product.brandId,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
    })
  }
}
