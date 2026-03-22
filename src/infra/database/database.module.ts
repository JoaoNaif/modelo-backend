import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { BrandRepository } from 'src/domain/main/app/_repositories/brand-repository'
import { PrismaBrandRepository } from './prisma/repositories/prisma-brand-repository'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { CategoryRepository } from 'src/domain/main/app/_repositories/category-repository'
import { ProductRepository } from 'src/domain/main/app/_repositories/product-repository'
import { PrismaProductRepository } from './prisma/repositories/prisma-product-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: BrandRepository,
      useClass: PrismaBrandRepository,
    },
    {
      provide: CategoryRepository,
      useClass: PrismaCategoryRepository,
    },
    {
      provide: ProductRepository,
      useClass: PrismaProductRepository,
    },
  ],
  exports: [BrandRepository, CategoryRepository, ProductRepository],
})
export class DatabaseModule {}
