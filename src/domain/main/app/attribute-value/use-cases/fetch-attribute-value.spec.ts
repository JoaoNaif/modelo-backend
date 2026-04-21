import { FetchAttributeValueUseCase } from './fetch-attribute-value'
import { InMemoryAttributeValueRepository } from 'test/repositories/in-memory-attribute-value-repository'
import { InMemoryAttributeRepository } from 'test/repositories/in-memory-attribute-repository'
import { makeAttributeValue } from 'test/factories/make-attribute-value'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

let inMemoryAttributeRepository: InMemoryAttributeRepository
let inMemoryAttributeValueRepository: InMemoryAttributeValueRepository
let useCase: FetchAttributeValueUseCase

describe('FetchAttributeValueUseCase', () => {
  beforeEach(() => {
    inMemoryAttributeRepository = new InMemoryAttributeRepository()
    inMemoryAttributeValueRepository = new InMemoryAttributeValueRepository(
      inMemoryAttributeRepository
    )
    useCase = new FetchAttributeValueUseCase(inMemoryAttributeValueRepository)
  })

  it('should be able to fetch attribute values by attribute id', async () => {
    const attributeId = new UniqueEntityId()

    const attributeValue1 = makeAttributeValue({
      attributeId: attributeId.toString(),
      value: 'Value 1',
    })
    const attributeValue2 = makeAttributeValue({
      attributeId: attributeId.toString(),
      value: 'Value 2',
    })
    const otherAttributeValue = makeAttributeValue({
      attributeId: new UniqueEntityId().toString(),
      value: 'Other Value',
    })

    await inMemoryAttributeValueRepository.create(attributeValue1)
    await inMemoryAttributeValueRepository.create(attributeValue2)
    await inMemoryAttributeValueRepository.create(otherAttributeValue)

    const result = await useCase.execute({
      attributeId: attributeId.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.attributesValue).toHaveLength(2)
      expect(result.value.attributesValue).toEqual([
        expect.objectContaining({ value: 'Value 1' }),
        expect.objectContaining({ value: 'Value 2' }),
      ])
    }
  })
})
