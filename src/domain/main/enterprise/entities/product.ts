import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface ProductProps {
  name: string
  description: string | null
  isActive: boolean
  brandId: string
  categoryId: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  get description() {
    return this.props.description
  }

  get isActive() {
    return this.props.isActive
  }

  get brandId() {
    return this.props.brandId
  }

  get categoryId() {
    return this.props.categoryId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ProductProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        isActive: props.isActive ?? true,
      },
      id
    )
    return product
  }
}
