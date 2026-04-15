import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Optional } from 'src/core/types/optional'

export interface AttributeValueProps {
  attributeId: string
  value: string
  createdAt: Date
  updatedAt?: Date | null
}

export class AttributeValue extends Entity<AttributeValueProps> {
  get attributeId() {
    return this.props.attributeId
  }

  get value() {
    return this.props.value
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<AttributeValueProps, 'createdAt'>,
    id?: UniqueEntityId
  ) {
    const attributeValue = new AttributeValue(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )
    return attributeValue
  }
}
