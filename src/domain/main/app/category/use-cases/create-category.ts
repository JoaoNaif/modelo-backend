import { Injectable } from '@nestjs/common'
import { Either, left, right } from 'src/core/either'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { Category } from 'src/domain/main/enterprise/entities/category'
import { CategoryRepository } from '../../_repositories/category-repository'
import { DtoGetCategory } from '../dtos/dto-get-category'

interface CreateCategoryUseCaseRequest {
  name: string
  parentId?: string | null
}

type CreateCategoryUseCaseResponse = Either<
  ResourceAlreadyExistError,
  {
    category: DtoGetCategory
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoryRepository: CategoryRepository) {}

  async execute({
    name,
    parentId,
  }: CreateCategoryUseCaseRequest): Promise<CreateCategoryUseCaseResponse> {
    const categoryAlreadyExists = await this.categoryRepository.findByName(name)

    if (categoryAlreadyExists) {
      return left(new ResourceAlreadyExistError(name))
    }

    const category = Category.create({
      name,
      parentId,
    })

    await this.categoryRepository.create(category)

    return right({
      category: {
        id: category.id.toString(),
        name: category.name,
        parentId: category.parentId,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt,
      },
    })
  }
}
