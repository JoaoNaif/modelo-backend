import { AddAttributeInProductVariantUseCase } from './add-attribute-in-product-variant'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { InMemoryProductPriceRepository } from 'test/repositories/in-memory-product-price-repository'
import { InMemoryAttributeValueRepository } from 'test/repositories/in-memory-attribute-value-repository'
import { InMemoryAttributeRepository } from 'test/repositories/in-memory-attribute-repository'
import { makeProductVariant } from 'test/factories/make-product-variant'
import { makeProductPrice } from 'test/factories/make-product-price'
import { makeAttribute } from 'test/factories/make-attribute'
import { makeAttributeValue } from 'test/factories/make-attribute-value'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

let inMemoryAttributeRepository: InMemoryAttributeRepository
let inMemoryAttributeValueRepository: InMemoryAttributeValueRepository
let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let inMemoryProductPriceRepository: InMemoryProductPriceRepository
let sut: AddAttributeInProductVariantUseCase

describe('Add Attribute in Product Variant', () => {
  beforeEach(() => {
    inMemoryAttributeRepository = new InMemoryAttributeRepository()
    inMemoryAttributeValueRepository = new InMemoryAttributeValueRepository(
      inMemoryAttributeRepository
    )
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository(
      inMemoryAttributeValueRepository
    )
    inMemoryProductPriceRepository = new InMemoryProductPriceRepository()
    sut = new AddAttributeInProductVariantUseCase(
      inMemoryProductVariantRepository,
      inMemoryProductPriceRepository,
      inMemoryAttributeValueRepository
    )
  })

  it('should be able to add an attribute to a product variant', async () => {
    const variant = makeProductVariant()
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

    const result = await sut.execute({
      productVariantId: variant.id.toString(),
      attributeValueId: attributeValue.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productVariant.attributes).toHaveLength(1)
      expect(result.value.productVariant.attributes[0]).toEqual(
        expect.objectContaining({
          name: 'Color',
          value: 'Red',
        })
      )
    }
  })

  it('should not be able to add the same attribute twice', async () => {
    const variant = makeProductVariant()
    await inMemoryProductVariantRepository.create(variant)

    await inMemoryProductPriceRepository.create(
      makeProductPrice({ variantId: variant.id.toString() })
    )

    const attribute = makeAttribute()
    await inMemoryAttributeRepository.create(attribute)

    const attributeValue = makeAttributeValue({
      attributeId: attribute.id.toString(),
    })
    await inMemoryAttributeValueRepository.create(attributeValue)

    await sut.execute({
      productVariantId: variant.id.toString(),
      attributeValueId: attributeValue.id.toString(),
    })

    const result = await sut.execute({
      productVariantId: variant.id.toString(),
      attributeValueId: attributeValue.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistError)
  })

  it('should not be able to add an attribute to a non-existing product variant', async () => {
    const attribute = makeAttribute()
    await inMemoryAttributeRepository.create(attribute)

    const attributeValue = makeAttributeValue({
      attributeId: attribute.id.toString(),
    })
    await inMemoryAttributeValueRepository.create(attributeValue)

    const result = await sut.execute({
      productVariantId: 'non-existing-id',
      attributeValueId: attributeValue.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to add a non-existing attribute to a product variant', async () => {
    const variant = makeProductVariant()
    await inMemoryProductVariantRepository.create(variant)

    await inMemoryProductPriceRepository.create(
      makeProductPrice({ variantId: variant.id.toString() })
    )

    const result = await sut.execute({
      productVariantId: variant.id.toString(),
      attributeValueId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
