import { InMemoryProductSectionRepository } from 'test/repositories/in-memory-product-section-repository'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'
import { FetchProductSectionUseCase } from './fetch-product-section'
import { makeProductSection } from 'test/factories/make-product-section'
import { makeProduct } from 'test/factories/make-prodcut'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'

let inMemoryProductSectionRepository: InMemoryProductSectionRepository
let inMemoryProductRepository: InMemoryProductRepository
let useCase: FetchProductSectionUseCase

describe('Fetch Product Sections', () => {
  beforeEach(() => {
    inMemoryProductSectionRepository = new InMemoryProductSectionRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    useCase = new FetchProductSectionUseCase(
      inMemoryProductSectionRepository,
      inMemoryProductRepository
    )
  })

  it('should be able to fetch product sections', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)
    const productId = product.id.toString()

    await inMemoryProductSectionRepository.create(
      makeProductSection({ productId })
    )
    await inMemoryProductSectionRepository.create(
      makeProductSection({ productId })
    )

    const result = await useCase.execute({
      productId,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productSections).toHaveLength(2)
      expect(result.value.productSections[0].productId).toBe(productId)
    }
  })

  it('should not be able to fetch product sections if product does not exist', async () => {
    const result = await useCase.execute({
      productId: 'non-existent-product-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return an empty list if no sections are found for an existing product', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)

    const result = await useCase.execute({
      productId: product.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.productSections).toHaveLength(0)
    }
  })
})
