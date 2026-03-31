import { ProductVariantRepository } from 'src/domain/main/app/_repositories/product-variant-repository'
import { ProductVariant } from 'src/domain/main/enterprise/entities/product-variant'

export class InMemoryProductVariantRepository implements ProductVariantRepository {
  private items: ProductVariant[] = []

  async create(productVariant: ProductVariant): Promise<void> {
    this.items.push(productVariant)
  }

  async findById(id: string): Promise<ProductVariant | null> {
    const productVariant = this.items.find((item) => item.id.toString() === id)

    if (!productVariant) {
      return null
    }

    return productVariant
  }

  async findAllByProductId(productId: string): Promise<ProductVariant[]> {
    return this.items.filter((item) => item.productId === productId)
  }

  async findByNameAndProductId(
    name: string,
    productId: string
  ): Promise<ProductVariant | null> {
    const productVariant = this.items.find(
      (item) => item.name === name && item.productId === productId
    )

    if (!productVariant) {
      return null
    }

    return productVariant
  }

  async findBySku(sku: string): Promise<ProductVariant | null> {
    const productVariant = this.items.find((item) => item.sku === sku)

    if (!productVariant) {
      return null
    }

    return productVariant
  }

  async save(productVariant: ProductVariant): Promise<void> {
    const index = this.items.findIndex((item) => item.id === productVariant.id)

    this.items[index] = productVariant
  }

  async delete(productVariant: ProductVariant): Promise<void> {
    const index = this.items.findIndex((item) => item.id === productVariant.id)

    if (index !== -1) {
      this.items.splice(index, 1)
    }
  }
}
