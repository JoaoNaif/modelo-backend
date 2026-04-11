import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export enum ProductSectionType {
  BENEFITS = 'BENEFITS',
  SPECIFICATIONS = 'SPECIFICATIONS',
  COMPOSITION = 'COMPOSITION',
}

export interface ProductSectionProps {
  productId: string
  type: ProductSectionType
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class ProductSection extends Entity<ProductSectionProps> {
  get productId() {
    return this.props.productId
  }

  get type() {
    return this.props.type
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<ProductSectionProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const productSection = new ProductSection(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return productSection
  }
}
