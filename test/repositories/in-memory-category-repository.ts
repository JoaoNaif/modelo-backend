import { CategoryRepository } from 'src/domain/main/app/_repositories/category-repository'
import { Category } from 'src/domain/main/enterprise/entities/category'

export class InMemoryCategoryRepository implements CategoryRepository {
  private items: Category[] = []

  async create(category: Category): Promise<void> {
    this.items.push(category)
  }

  async findById(id: string): Promise<Category | null> {
    const category = this.items.find((item) => item.id.toString() === id)

    if (!category) {
      return null
    }

    return category
  }

  async findByName(name: string): Promise<Category | null> {
    const category = this.items.find((item) => item.name === name)

    if (!category) {
      return null
    }

    return category
  }

  async findAll(search: string): Promise<Category[]> {
    if (!search) {
      return this.items
    }

    return this.items.filter((item) => item.name.includes(search))
  }

  async save(category: Category): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items[itemIndex] = category
  }

  async delete(category: Category): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === category.id)

    this.items.splice(itemIndex, 1)
  }
}
