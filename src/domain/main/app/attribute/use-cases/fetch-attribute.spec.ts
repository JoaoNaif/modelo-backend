import { FetchAttributeUseCase } from './fetch-attribute'
import { InMemoryAttributeRepository } from 'test/repositories/in-memory-attribute-repository'
import { makeAttribute } from 'test/factories/make-attribute'

let inMemoryAttributeRepository: InMemoryAttributeRepository
let useCase: FetchAttributeUseCase

describe('FetchAttributeUseCase', () => {
  beforeEach(() => {
    inMemoryAttributeRepository = new InMemoryAttributeRepository()
    useCase = new FetchAttributeUseCase(inMemoryAttributeRepository)
  })

  it('should be able to fetch attributes', async () => {
    const attribute1 = makeAttribute({ name: 'Color' })
    const attribute2 = makeAttribute({ name: 'Size' })

    await inMemoryAttributeRepository.create(attribute1)
    await inMemoryAttributeRepository.create(attribute2)

    const result = await useCase.execute({
      search: '',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.attributes).toHaveLength(2)
      expect(result.value.attributes).toEqual([
        expect.objectContaining({ name: 'Color' }),
        expect.objectContaining({ name: 'Size' }),
      ])
    }
  })

  it('should be able to fetch attributes with search', async () => {
    const attribute1 = makeAttribute({ name: 'Color' })
    const attribute2 = makeAttribute({ name: 'Size' })
    const attribute3 = makeAttribute({ name: 'Material' })

    await inMemoryAttributeRepository.create(attribute1)
    await inMemoryAttributeRepository.create(attribute2)
    await inMemoryAttributeRepository.create(attribute3)

    const result = await useCase.execute({
      search: 'size',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.attributes).toHaveLength(1)
      expect(result.value.attributes).toEqual([
        expect.objectContaining({ name: 'Size' }),
      ])
    }
  })
})
