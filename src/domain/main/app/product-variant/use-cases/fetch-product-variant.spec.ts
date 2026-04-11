import { FetchProductVariantUseCase } from './fetch-product-variant'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { makeProductVariant } from 'test/factories/make-product-variant'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { InMemoryProductPriceRepository } from 'test/repositories/in-memory-product-price-repository'
import { makeProductPrice } from 'test/factories/make-product-price'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'

let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let inMemoryProductPriceRepository: InMemoryProductPriceRepository
let useCase: FetchProductVariantUseCase

describe('Fetch Product Variants', () => {
  beforeEach(() => {
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository()
    inMemoryProductPriceRepository = new InMemoryProductPriceRepository()
    useCase = new FetchProductVariantUseCase(
      inMemoryProductVariantRepository,
      inMemoryProductPriceRepository
    )
  })

  it('should be able to fetch product variants', async () => {
    const productId = new UniqueEntityId().toString()

    const productVariant1 = makeProductVariant({ productId })
    const productVariant2 = makeProductVariant({ productId })

    await inMemoryProductVariantRepository.create(productVariant1)
    await inMemoryProductVariantRepository.create(productVariant2)

    await inMemoryProductPriceRepository.create(
      makeProductPrice({ variantId: productVariant1.id.toString() })
    )
    await inMemoryProductPriceRepository.create(
      makeProductPrice({ variantId: productVariant2.id.toString() })
    )

    const result = await useCase.execute({ productId })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariants).toHaveLength(2)
      expect(result.value.productVariants[0].productId).toBe(productId)
    }
  })

  it('should not be able to fetch product variants if one price is missing', async () => {
    const productId = new UniqueEntityId().toString()
    const productVariant = makeProductVariant({ productId })

    await inMemoryProductVariantRepository.create(productVariant)
    // Preço NÃO criado propositalmente

    const result = await useCase.execute({ productId })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
