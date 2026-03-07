import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface BrandProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Brand extends Entity<BrandProps> {
  get name() {
    return this.props.name
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

  static create(props: Optional<BrandProps, 'createdAt'>, id?: UniqueEntityId) {
    const brand = new Brand(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return brand
  }
}
