import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface ProductVariantProps {
  productId: string
  name: string
  sku: string
  createdAt: Date
  updatedAt?: Date | null
}

export class ProductVariant extends Entity<ProductVariantProps> {
  get productId() {
    return this.props.productId
  }

  get name() {
    return this.props.name
  }

  get sku() {
    return this.props.sku
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<ProductVariantProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const productVariant = new ProductVariant(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return productVariant
  }
}
