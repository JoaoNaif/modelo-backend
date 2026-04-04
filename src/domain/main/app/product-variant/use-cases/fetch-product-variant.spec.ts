import { FetchProductVariantUseCase } from './fetch-product-variant'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { makeProductVariant } from 'test/factories/make-product-variant'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { InMemoryProductPriceRepository } from 'test/repositories/in-memory-product-price-repository'
import { makeProductPrice } from 'test/factories/make-product-price'

let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let inMemoryProductPriceRepository: InMemoryProductPriceRepository
let useCase: FetchProductVariantUseCase

describe('FetchProductVariantUseCase', () => {
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

    const productVariant1 = makeProductVariant({
      productId,
    })
    const productVariant2 = makeProductVariant({
      productId,
    })
    const productVariant3 = makeProductVariant({
      productId: 'another-product-id',
    })

    await inMemoryProductVariantRepository.create(productVariant1)
    await inMemoryProductVariantRepository.create(productVariant2)
    await inMemoryProductVariantRepository.create(productVariant3)

    const productPrice1 = makeProductPrice({
      variantId: productVariant1.id.toString(),
      costPrice: 10,
    })
    const productPrice2 = makeProductPrice({
      variantId: productVariant2.id.toString(),
      costPrice: 20,
    })
    const productPrice3 = makeProductPrice({
      variantId: productVariant3.id.toString(),
      costPrice: 30,
    })

    await inMemoryProductPriceRepository.create(productPrice1)
    await inMemoryProductPriceRepository.create(productPrice2)
    await inMemoryProductPriceRepository.create(productPrice3)

    const result = await useCase.execute({
      productId,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariants).toHaveLength(2)
      expect(result.value.productVariants).toEqual([
        expect.objectContaining({
          id: productVariant1.id.toString(),
          price: expect.objectContaining({ costPrice: 10 }),
        }),
        expect.objectContaining({
          id: productVariant2.id.toString(),
          price: expect.objectContaining({ costPrice: 20 }),
        }),
      ])
    }
  })
})
