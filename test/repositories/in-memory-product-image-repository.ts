import { ProductImageRepository } from 'src/domain/main/app/_repositories/product-image-repository'
import { ProductImage } from 'src/domain/main/enterprise/entities/product-image'

export class InMemoryProductImageRepository implements ProductImageRepository {
  public items: ProductImage[] = []

  async create(productImage: ProductImage): Promise<void> {
    this.items.push(productImage)
  }

  async findById(id: string): Promise<ProductImage | null> {
    const productImage = this.items.find((item) => item.id.toString() === id)

    if (!productImage) {
      return null
    }

    return productImage
  }

  async findAllByProductId(productId: string): Promise<ProductImage[]> {
    return this.items.filter((item) => item.productId === productId)
  }

  async save(productImage: ProductImage): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === productImage.id)

    this.items[itemIndex] = productImage
  }

  async delete(productImage: ProductImage): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === productImage.id)

    this.items.splice(itemIndex, 1)
  }
}
