import { CreateCategoryUseCase } from './create-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let useCase: CreateCategoryUseCase

describe('CreateBrandUseCase', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    useCase = new CreateCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to create a category', async () => {
    const result = await useCase.execute({
      name: 'Category 1',
      parentId: null,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.category.id).toBeDefined()
      expect(result.value.category.name).toBe('Category 1')
    }
  })
})
