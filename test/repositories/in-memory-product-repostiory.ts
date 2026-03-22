import { ProductRepository } from 'src/domain/main/app/_repositories/product-repository'
import { Product } from 'src/domain/main/enterprise/entities/product'

export class InMemoryProductRepository implements ProductRepository {
  private items: Product[] = []

  async create(product: Product): Promise<void> {
    this.items.push(product)
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id)

    if (!product) {
      return null
    }

    return product
  }

  async findAll(search: string): Promise<Product[]> {
    return this.items.filter((item) => item.name.includes(search))
  }

  async findByNameAndBrand(
    name: string,
    brandId: string
  ): Promise<Product | null> {
    const product = this.items.find(
      (item) => item.name === name && item.brandId === brandId
    )

    if (!product) {
      return null
    }

    return product
  }

  async save(product: Product): Promise<void> {
    const index = this.items.findIndex((item) => item.id === product.id)

    this.items[index] = product
  }

  async delete(product: Product): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === product.id)

    this.items.splice(itemIndex, 1)
  }
}
