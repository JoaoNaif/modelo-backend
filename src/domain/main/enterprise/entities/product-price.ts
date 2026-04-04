import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface ProductPriceProps {
  variantId: string
  costPrice: number
  originalPrice: number | null
  salePrice: number
  installments: number | null
  hasInterest: boolean
  createdAt: Date
  updatedAt?: Date | null
}

export class ProductPrice extends Entity<ProductPriceProps> {
  get variantId() {
    return this.props.variantId
  }

  get costPrice() {
    return this.props.costPrice
  }

  get originalPrice() {
    return this.props.originalPrice
  }

  get salePrice() {
    return this.props.salePrice
  }

  get installments() {
    return this.props.installments
  }

  get hasInterest() {
    return this.props.hasInterest
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<ProductPriceProps, 'createdAt' | 'hasInterest'>,
    id?: UniqueEntityId
  ) {
    const productPrice = new ProductPrice(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        hasInterest: props.hasInterest ?? false,
      },
      id
    )
    return productPrice
  }
}
