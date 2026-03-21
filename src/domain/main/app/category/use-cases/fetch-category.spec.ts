import { CreateCategoryUseCase } from './create-category'
import { InMemoryCategoryRepository } from 'test/repositories/in-memory-category-repository'
import { FetchCategoryUseCase } from './fetch-category'
import { makeCategory } from 'test/factories/make-category'

let inMemoryCategoryRepository: InMemoryCategoryRepository
let useCase: FetchCategoryUseCase

describe('FetchCategoryUseCase', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository()
    useCase = new FetchCategoryUseCase(inMemoryCategoryRepository)
  })

  it('should be able to create a category', async () => {
    const brand1 = makeCategory()
    const brand2 = makeCategory()

    await inMemoryCategoryRepository.create(brand1)
    await inMemoryCategoryRepository.create(brand2)

    const result = await useCase.execute({
      search: '',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.categories).toHaveLength(2)
    }
  })
})
