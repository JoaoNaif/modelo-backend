import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'
import { CreateProductUseCase } from './create-product'

let inMemoryProductRepository: InMemoryProductRepository
let useCase: CreateProductUseCase

describe('CreateProductUseCase', () => {
  beforeEach(() => {
    inMemoryProductRepository = new InMemoryProductRepository()
    useCase = new CreateProductUseCase(inMemoryProductRepository)
  })

  it('should be able to create a product', async () => {
    const result = await useCase.execute({
      name: 'Product 1',
      brandId: 'Brand 1',
      categoryId: 'Category 1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.product.id).toBeDefined()
      expect(result.value.product.name).toBe('Product 1')
    }
  })
})
