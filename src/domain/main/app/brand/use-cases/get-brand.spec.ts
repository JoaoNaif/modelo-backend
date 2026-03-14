import { InMemoryBrandRepository } from 'test/repositories/in-memory-brand-repository'
import { GetBrandUseCase } from './get-user'
import { makeBrand } from 'test/factories/make-brand'

let inMemoryBrandRepository: InMemoryBrandRepository
let useCase: GetBrandUseCase

describe('GetBrandUseCase', () => {
  beforeEach(() => {
    inMemoryBrandRepository = new InMemoryBrandRepository()
    useCase = new GetBrandUseCase(inMemoryBrandRepository)
  })

  it('should be able to get a brand', async () => {
    const brand = makeBrand()

    await inMemoryBrandRepository.create(brand)

    const result = await useCase.execute({
      id: brand.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.brand.name).toBe(brand.name)
    }
  })
})
