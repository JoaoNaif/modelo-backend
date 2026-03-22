import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { DtoGetProduct } from '../dtos/dto-get-product'
import { Injectable } from '@nestjs/common'
import { ProductRepository } from '../../_repositories/product-repository'
import { Product } from 'src/domain/main/enterprise/entities/product'

interface CreateProductUseCaseRequest {
  name: string
  description?: string | null
  isActive?: boolean
  brandId: string
  categoryId?: string | null
}

type CreateProductUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    product: DtoGetProduct
  }
>

@Injectable()
export class CreateProductUseCase {
  constructor(private productRepository: ProductRepository) {}

  async execute({
    name,
    description,
    isActive,
    brandId,
    categoryId,
  }: CreateProductUseCaseRequest): Promise<CreateProductUseCaseResponse> {
    const productAlreadyExists =
      await this.productRepository.findByNameAndBrand(name, brandId)

    if (productAlreadyExists) {
      return left(new ResourceAlreadyExistError(name))
    }

    const product = Product.create({
      name,
      description: description ?? null,
      isActive: isActive ?? true,
      brandId,
      categoryId: categoryId ?? null,
    })

    await this.productRepository.create(product)

    return right({
      product: {
        id: product.id.toString(),
        name: product.name,
        description: product.description,
        isActive: product.isActive,
        brandId: product.brandId,
        categoryId: product.categoryId,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      },
    })
  }
}
