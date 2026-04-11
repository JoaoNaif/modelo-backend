import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface ProductImageProps {
  productId: string
  variantId: string | null
  title: string | null
  url: string
  order: number
  createdAt: Date
}

export class ProductImage extends Entity<ProductImageProps> {
  get productId() {
    return this.props.productId
  }

  get variantId() {
    return this.props.variantId
  }

  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  get order() {
    return this.props.order
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ProductImageProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const productImage = new ProductImage(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return productImage
  }
}
