import { CreateProductVariantUseCase } from './create-product-variant'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { makeProduct } from 'test/factories/make-prodcut'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'
import { InMemoryProductPriceRepository } from 'test/repositories/in-memory-product-price-repository'

let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let inMemoryProductRepository: InMemoryProductRepository
let inMemoryProductPriceRepository: InMemoryProductPriceRepository
let useCase: CreateProductVariantUseCase

describe('CreateProductVariantUseCase', () => {
  beforeEach(() => {
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryProductPriceRepository = new InMemoryProductPriceRepository()
    useCase = new CreateProductVariantUseCase(
      inMemoryProductVariantRepository,
      inMemoryProductRepository,
      inMemoryProductPriceRepository
    )
  })

  it('should be able to create a product variant', async () => {
    const product = makeProduct()

    await inMemoryProductRepository.create(product)

    const result = await useCase.execute({
      name: 'Product 1',
      productId: product.id.toString(),
      sku: 'SKU 1',
      costPrice: 10,
      originalPrice: 20,
      salePrice: 15,
      installments: 3,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariant.id).toBeDefined()
      expect(result.value.productVariant.name).toBe('Product 1')
      expect(result.value.productVariant.productId).toBe(product.id.toString())
      expect(result.value.productVariant.sku).toBe('SKU 1')
      expect(result.value.productVariant.price).toEqual(
        expect.objectContaining({
          costPrice: 10,
          originalPrice: 20,
          salePrice: 15,
          installments: 3,
          hasInterest: false,
        })
      )
      expect(inMemoryProductPriceRepository.items).toHaveLength(1)
      expect(inMemoryProductPriceRepository.items[0].variantId).toBe(
        result.value.productVariant.id
      )
    }
  })
})
