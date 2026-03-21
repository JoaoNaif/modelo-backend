import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface CategoryProps {
  name: string
  parentId?: string | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Category extends Entity<CategoryProps> {
  get name() {
    return this.props.name
  }

  get parentId() {
    return this.props.parentId
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

  static create(props: Optional<CategoryProps, 'createdAt'>, id?: UniqueEntityId) {
    const category = new Category(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return category
  }
}
