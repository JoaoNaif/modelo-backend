import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { InMemoryProductPriceRepository } from 'test/repositories/in-memory-product-price-repository'
import { InMemoryAttributeValueRepository } from 'test/repositories/in-memory-attribute-value-repository'
import { InMemoryAttributeRepository } from 'test/repositories/in-memory-attribute-repository'
import { AllProductVariantUseCase } from './all-product-variant'
import { makeProductVariant } from 'test/factories/make-product-variant'
import { makeProductPrice } from 'test/factories/make-product-price'
import { makeAttribute } from 'test/factories/make-attribute'
import { makeAttributeValue } from 'test/factories/make-attribute-value'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let inMemoryProductPriceRepository: InMemoryProductPriceRepository
let inMemoryAttributeRepository: InMemoryAttributeRepository
let inMemoryAttributeValueRepository: InMemoryAttributeValueRepository
let sut: AllProductVariantUseCase

describe('All Product Variants', () => {
  beforeEach(() => {
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository()
    inMemoryProductPriceRepository = new InMemoryProductPriceRepository()
    inMemoryAttributeRepository = new InMemoryAttributeRepository()
    inMemoryAttributeValueRepository = new InMemoryAttributeValueRepository(
      inMemoryAttributeRepository
    )
    sut = new AllProductVariantUseCase(
      inMemoryProductVariantRepository,
      inMemoryProductPriceRepository,
      inMemoryAttributeValueRepository
    )
  })

  it('should be able to fetch product variants with attributes', async () => {
    const productId = new UniqueEntityId()

    const variant = makeProductVariant({ productId: productId.toString() })
    await inMemoryProductVariantRepository.create(variant)

    await inMemoryProductPriceRepository.create(
      makeProductPrice({ variantId: variant.id.toString() })
    )

    const attribute = makeAttribute({ name: 'Color' })
    await inMemoryAttributeRepository.create(attribute)

    const attributeValue = makeAttributeValue({
      attributeId: attribute.id.toString(),
      value: 'Red',
    })
    await inMemoryAttributeValueRepository.create(attributeValue)

    inMemoryAttributeValueRepository.variantAttributeValues.push({
      variantId: variant.id.toString(),
      attributeValueId: attributeValue.id.toString(),
    })

    const result = await sut.execute({
      productId: productId.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariants).toHaveLength(1)
      expect(result.value.productVariants[0].attributes).toHaveLength(1)
      expect(result.value.productVariants[0].attributes[0]).toEqual(
        expect.objectContaining({
          name: 'Color',
          value: 'Red',
        })
      )
    }
  })
})
