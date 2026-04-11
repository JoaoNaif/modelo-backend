import { ProductSectionRepository } from 'src/domain/main/app/_repositories/product-section-repository'
import { ProductSection } from 'src/domain/main/enterprise/entities/product-section'

export class InMemoryProductSectionRepository implements ProductSectionRepository {
  public items: ProductSection[] = []

  async create(productSection: ProductSection): Promise<void> {
    this.items.push(productSection)
  }

  async findById(id: string): Promise<ProductSection | null> {
    const productSection = this.items.find((item) => item.id.toString() === id)

    if (!productSection) {
      return null
    }

    return productSection
  }

  async findAllByProductId(productId: string): Promise<ProductSection[]> {
    return this.items.filter((item) => item.productId === productId)
  }

  async save(productSection: ProductSection): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(productSection.id))

    if (index >= 0) {
      this.items[index] = productSection
    }
  }

  async delete(productSection: ProductSection): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id.equals(productSection.id))

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
