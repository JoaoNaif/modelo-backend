import { FetchProductVariantUseCase } from './fetch-product-variant'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { makeProductVariant } from 'test/factories/make-product-variant'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let useCase: FetchProductVariantUseCase

describe('FetchProductVariantUseCase', () => {
  beforeEach(() => {
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository()
    useCase = new FetchProductVariantUseCase(inMemoryProductVariantRepository)
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

    const result = await useCase.execute({
      productId,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariants).toHaveLength(2)
      expect(result.value.productVariants).toEqual([
        expect.objectContaining({ id: productVariant1.id.toString() }),
        expect.objectContaining({ id: productVariant2.id.toString() }),
      ])
    }
  })
})
