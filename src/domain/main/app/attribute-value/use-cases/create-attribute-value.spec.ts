import { InMemoryAttributeRepository } from 'test/repositories/in-memory-attribute-repository'
import { InMemoryAttributeValueRepository } from 'test/repositories/in-memory-attribute-value-repository'
import { CreateAttributeValueUseCase } from './create-attribute-value'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { makeAttribute } from 'test/factories/make-attribute'
import { makeAttributeValue } from 'test/factories/make-attribute-value'

let inMemoryAttributeRepository: InMemoryAttributeRepository
let inMemoryAttributeValueRepository: InMemoryAttributeValueRepository
let sut: CreateAttributeValueUseCase

describe('CreateAttributeValueUseCase', () => {
  beforeEach(() => {
    inMemoryAttributeRepository = new InMemoryAttributeRepository()
    inMemoryAttributeValueRepository = new InMemoryAttributeValueRepository(
      inMemoryAttributeRepository
    )
    sut = new CreateAttributeValueUseCase(
      inMemoryAttributeRepository,
      inMemoryAttributeValueRepository
    )
  })

  it('should be able to create an attribute value', async () => {
    const attribute = makeAttribute()
    await inMemoryAttributeRepository.create(attribute)

    const result = await sut.execute({
      attributeId: attribute.id.toString(),
      value: 'Red',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.attributeValue.id).toBeDefined()
      expect(result.value.attributeValue.value).toBe('Red')
      expect(inMemoryAttributeValueRepository.items[0].value).toBe('Red')
    }
  })

  it('should not be able to create an attribute value if attribute does not exist', async () => {
    const result = await sut.execute({
      attributeId: 'non-existing-id',
      value: 'Red',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create an attribute value with same value for the same attribute', async () => {
    const attribute = makeAttribute()
    await inMemoryAttributeRepository.create(attribute)

    const attributeValue = makeAttributeValue({
      attributeId: attribute.id.toString(),
      value: 'Blue',
    })
    await inMemoryAttributeValueRepository.create(attributeValue)

    const result = await sut.execute({
      attributeId: attribute.id.toString(),
      value: 'Blue',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistError)
  })
})
