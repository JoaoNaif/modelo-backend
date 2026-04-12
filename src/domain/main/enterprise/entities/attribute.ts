import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface AttributeProps {
  name: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Attribute extends Entity<AttributeProps> {
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

  static create(
    props: Optional<AttributeProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const attribute = new Attribute(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return attribute
  }
}
