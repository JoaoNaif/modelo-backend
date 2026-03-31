import { CreateProductVariantUseCase } from './create-product-variant'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { makeProduct } from 'test/factories/make-prodcut'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'

let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let inMemoryProductRepository: InMemoryProductRepository
let useCase: CreateProductVariantUseCase

describe('CreateProductVariantUseCase', () => {
  beforeEach(() => {
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    useCase = new CreateProductVariantUseCase(
      inMemoryProductVariantRepository,
      inMemoryProductRepository
    )
  })

  it('should be able to create a product variant', async () => {
    const product = makeProduct()

    await inMemoryProductRepository.create(product)

    const result = await useCase.execute({
      name: 'Product 1',
      productId: product.id.toString(),
      sku: 'SKU 1',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariant.id).toBeDefined()
      expect(result.value.productVariant.name).toBe('Product 1')
      expect(result.value.productVariant.productId).toBe(product.id.toString())
      expect(result.value.productVariant.sku).toBe('SKU 1')
    }
  })
})
