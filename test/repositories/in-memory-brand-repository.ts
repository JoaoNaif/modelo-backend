import { BrandRepository } from 'src/domain/main/app/_repositories/brand-repository'
import { Brand } from 'src/domain/main/enterprise/entities/brand'

export class InMemoryBrandRepository implements BrandRepository {
  private items: Brand[] = []

  async create(brand: Brand): Promise<void> {
    this.items.push(brand)
  }

  async findById(id: string): Promise<Brand | null> {
    const brand = this.items.find((item) => item.id.toString() === id)

    if (!brand) {
      return null
    }

    return brand
  }

  async findByName(name: string): Promise<Brand | null> {
    const brand = this.items.find((item) => item.name === name)

    if (!brand) {
      return null
    }

    return brand
  }

  async findAll(): Promise<Brand[]> {
    return this.items
  }

  async save(brand: Brand): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === brand.id)

    this.items[itemIndex] = brand
  }

  async delete(brand: Brand): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === brand.id)

    this.items.splice(itemIndex, 1)
  }
}
