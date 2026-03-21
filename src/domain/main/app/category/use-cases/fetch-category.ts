import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { CategoryRepository } from '../../_repositories/category-repository'
import { DtoGetCategory } from '../dtos/dto-get-category'

interface FetchCategoryUseCaseRequest {
  search: string
}

type FetchCategoryUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    categories: DtoGetCategory[]
  }
>

@Injectable()
export class FetchCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    search,
  }: FetchCategoryUseCaseRequest): Promise<FetchCategoryUseCaseResponse> {
    const categories = await this.categoryRepository.findAll(search)

    return right({
      categories: categories.map((category) => ({
        id: category.id.toString(),
        name: category.name,
        parentId: category.parentId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      })),
    })
  }
}
