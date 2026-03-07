import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository'
import { CreateBrandUseCase } from './create-brand'

let inMemoryBrandRepository: InMemoryBrandRepository
let useCase: CreateBrandUseCase

describe('CreateBrandUseCase', () => {
  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository()
    useCase = new CreateBrandUseCase(inMemoryBrandRepository)
  })

  it('should be able to create a brand', async () => {
    const result = await useCase.execute({
      name: 'Brand 1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.brand.id).toBeDefined()
      expect(result.value.brand.name).toBe('Brand 1')
    }
  })
})
