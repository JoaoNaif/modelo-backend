import { InMemoryProductSectionRepository } from 'test/repositories/in-memory-product-section-repository'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'
import { CreateProductSectionUseCase } from './create-product-section'
import { makeProduct } from 'test/factories/make-prodcut'
import { ProductSectionType } from 'src/domain/main/enterprise/entities/product-section'

let inMemoryProductSectionRepository: InMemoryProductSectionRepository
let inMemoryProductRepository: InMemoryProductRepository
let useCase: CreateProductSectionUseCase

describe('Create Product Section', () => {
  beforeEach(() => {
    inMemoryProductSectionRepository = new InMemoryProductSectionRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    useCase = new CreateProductSectionUseCase(
      inMemoryProductSectionRepository,
      inMemoryProductRepository
    )
  })

  it('should be able to create a product section', async () => {
    const product = makeProduct()

    await inMemoryProductRepository.create(product)

    const result = await useCase.execute({
      productId: product.id.toString(),
      title: 'Benefícios',
      content: 'Conteúdo dos benefícios',
      type: ProductSectionType.BENEFITS,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(inMemoryProductSectionRepository.items[0]).toEqual(
        expect.objectContaining({
          title: 'Benefícios',
          productId: product.id.toString(),
        })
      )
      expect(result.value.productSection.id).toBeDefined()
      expect(result.value.productSection.productId).toBe(product.id.toString())
    }
  })

  it('should not be able to create a product section if product does not exist', async () => {
    const result = await useCase.execute({
      productId: 'non-existent-id',
      title: 'Benefícios',
      content: 'Conteúdo dos benefícios',
      type: ProductSectionType.BENEFITS,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })

  it('should not be able to create a product section if it already exists for the product', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)

    await useCase.execute({
      productId: product.id.toString(),
      title: 'Benefícios 1',
      content: 'Conteúdo 1',
      type: ProductSectionType.BENEFITS,
    })

    const result = await useCase.execute({
      productId: product.id.toString(),
      title: 'Benefícios 2',
      content: 'Conteúdo 2',
      type: ProductSectionType.BENEFITS,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(Error)
  })
})
