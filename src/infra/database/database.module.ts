import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { BrandRepository } from 'src/domain/main/app/_repositories/brand-repository'
import { PrismaBrandRepository } from './prisma/repositories/prisma-brand-repository'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { CategoryRepository } from 'src/domain/main/app/_repositories/category-repository'
import { ProductRepository } from 'src/domain/main/app/_repositories/product-repository'
import { PrismaProductRepository } from './prisma/repositories/prisma-product-repository'
import { ProductVariantRepository } from 'src/domain/main/app/_repositories/product-variant-repository'
import { PrismaProductVariantRepository } from './prisma/repositories/prisma-product-variant-repository'
import { ProductPriceRepository } from 'src/domain/main/app/_repositories/product-price-repository'
import { PrismaProductPriceRepository } from './prisma/repositories/prisma-product-price-repository'
import { ProductImageRepository } from 'src/domain/main/app/_repositories/product-image-repository'
import { PrismaProductImageRepository } from './prisma/repositories/prisma-product-image-repository'

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
    {
      provide: ProductVariantRepository,
      useClass: PrismaProductVariantRepository,
    },
    {
      provide: ProductPriceRepository,
      useClass: PrismaProductPriceRepository,
    },
    {
      provide: ProductImageRepository,
      useClass: PrismaProductImageRepository,
    },
  ],
  exports: [
    BrandRepository,
    CategoryRepository,
    ProductRepository,
    ProductVariantRepository,
    ProductPriceRepository,
    ProductImageRepository,
  ],
})
export class DatabaseModule {}
