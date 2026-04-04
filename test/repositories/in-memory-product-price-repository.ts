import { ProductPriceRepository } from 'src/domain/main/app/_repositories/product-price-repository'
import { ProductPrice } from 'src/domain/main/enterprise/entities/product-price'

export class InMemoryProductPriceRepository implements ProductPriceRepository {
  public items: ProductPrice[] = []

  async create(productPrice: ProductPrice) {
    this.items.push(productPrice)
  }

  async findByVariantId(variantId: string) {
    const productPrice = this.items.find((item) => item.variantId === variantId)

    if (!productPrice) {
      return null
    }

    return productPrice
  }

  async save(productPrice: ProductPrice) {
    const itemIndex = this.items.findIndex((item) => item.id === productPrice.id)

    this.items[itemIndex] = productPrice
  }

  async delete(productPrice: ProductPrice) {
    const itemIndex = this.items.findIndex((item) => item.id === productPrice.id)

    this.items.splice(itemIndex, 1)
  }
}
