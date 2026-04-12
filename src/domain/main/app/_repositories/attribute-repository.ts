import { Attribute } from '../../enterprise/entities/attribute'

export abstract class AttributeRepository {
  abstract create(attribute: Attribute): Promise<void>
  abstract findById(id: string): Promise<Attribute | null>
  abstract findByName(name: string): Promise<Attribute | null>
  abstract findAll(): Promise<Attribute[]>
  abstract save(attribute: Attribute): Promise<void>
  abstract delete(attribute: Attribute): Promise<void>
}
