import { InMemoryAttributeRepository } from 'test/repositories/in-memory-attribute-repository'
import { CreateAttributeUseCase } from './create-attribute'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { Attribute } from '../../../enterprise/entities/attribute'

let inMemoryAttributeRepository: InMemoryAttributeRepository
let sut: CreateAttributeUseCase

describe('CreateAttributeUseCase', () => {
  beforeEach(() => {
    inMemoryAttributeRepository = new InMemoryAttributeRepository()
    sut = new CreateAttributeUseCase(inMemoryAttributeRepository)
  })

  it('should be able to create an attribute', async () => {
    const result = await sut.execute({
      name: 'Color',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.attribute.id).toBeDefined()
      expect(typeof result.value.attribute.id).toBe('string')
      expect(result.value.attribute.name).toBe('Color')
      expect(inMemoryAttributeRepository.items[0].name).toBe('Color')
    }
  })

  it('should not be able to create an attribute with same name', async () => {
    const attribute = Attribute.create({
      name: 'Size',
    })
    await inMemoryAttributeRepository.create(attribute)

    const result = await sut.execute({
      name: 'Size',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistError)
  })
})
