import { Brand } from '../../enterprise/entities/brand'

export abstract class BrandRepository {
  abstract create(brand: Brand): Promise<void>
  abstract findById(id: string): Promise<Brand | null>
  abstract findByName(name: string): Promise<Brand | null>
  abstract findAll(): Promise<Brand[]>
  abstract save(brand: Brand): Promise<void>
  abstract delete(brand: Brand): Promise<void>
}
