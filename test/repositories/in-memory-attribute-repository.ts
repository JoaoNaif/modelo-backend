import { AttributeRepository } from 'src/domain/main/app/_repositories/attribute-repository'
import { Attribute } from 'src/domain/main/enterprise/entities/attribute'

export class InMemoryAttributeRepository implements AttributeRepository {
  public items: Attribute[] = []

  async create(attribute: Attribute): Promise<void> {
    this.items.push(attribute)
  }

  async findById(id: string): Promise<Attribute | null> {
    const attribute = this.items.find((item) => item.id.toString() === id)

    if (!attribute) {
      return null
    }

    return attribute
  }

  async findByName(name: string): Promise<Attribute | null> {
    const attribute = this.items.find((item) => item.name === name)

    if (!attribute) {
      return null
    }

    return attribute
  }

  async findAll(search: string): Promise<Attribute[]> {
    if (search) {
      return this.items.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }

    return this.items
  }

  async save(attribute: Attribute): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === attribute.id)

    this.items[itemIndex] = attribute
  }

  async delete(attribute: Attribute): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === attribute.id)

    this.items.splice(itemIndex, 1)
  }
}
