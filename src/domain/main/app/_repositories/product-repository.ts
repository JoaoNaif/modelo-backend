import { Product } from '../../enterprise/entities/product'

export abstract class ProductRepository {
  abstract create(product: Product): Promise<void>
  abstract findById(id: string): Promise<Product | null>
  abstract findAll(search: string): Promise<Product[]>
  abstract findByNameAndBrand(
    name: string,
    brandId: string
  ): Promise<Product | null>
  abstract save(product: Product): Promise<void>
  abstract delete(product: Product): Promise<void>
}
