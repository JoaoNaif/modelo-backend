import { FetchProductUseCase } from './fetch-product'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'
import { makeProduct } from 'test/factories/make-prodcut'

let inMemoryProductRepository: InMemoryProductRepository
let useCase: FetchProductUseCase

describe('FetchProductUseCase', () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    useCase = new FetchProductUseCase(inMemoryProductRepository)
  })

  it('should be able to create a product', async () => {
    const product1 = makeProduct()
    const product2 = makeProduct()

    await inMemoryProductRepository.create(product1)
    await inMemoryProductRepository.create(product2)

    const result = await useCase.execute({
      search: '',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.products).toHaveLength(2)
    }
  })
})
