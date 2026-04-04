import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateBrandController } from './controller/brand/create-brand.controller'
import { CreateBrandUseCase } from 'src/domain/main/app/brand/use-cases/create-brand'
import { GetBrandController } from './controller/brand/get-brand.controller'
import { GetBrandUseCase } from 'src/domain/main/app/brand/use-cases/get-brand'
import { CreateCategoryController } from './controller/category/create-category.controller'
import { CreateCategoryUseCase } from 'src/domain/main/app/category/use-cases/create-category'
import { FetchCategoryController } from './controller/category/fetch-category.controller'
import { FetchCategoryUseCase } from 'src/domain/main/app/category/use-cases/fetch-category'
import { CreateProductUseCase } from 'src/domain/main/app/product/use-cases/create-product'
import { CreateProductController } from './controller/product/create-product.controller'
import { FetchProductController } from './controller/product/fetch-product.controller'
import { FetchProductUseCase } from 'src/domain/main/app/product/use-cases/fetch-product'
import { CreateProductVariantController } from './controller/product-variant/create-product-variant.controller'
import { CreateProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/create-product-variant'
import { FetchProductVariantController } from './controller/product-variant/fetch-product-variant.controller'
import { FetchProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/fetch-product-variant'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateBrandController,
    GetBrandController,
    CreateCategoryController,
    FetchCategoryController,
    CreateProductController,
    FetchProductController,
    CreateProductVariantController,
    FetchProductVariantController,
  ],
  providers: [
    CreateBrandUseCase,
    GetBrandUseCase,
    CreateCategoryUseCase,
    FetchCategoryUseCase,
    CreateProductUseCase,
    FetchProductUseCase,
    CreateProductVariantUseCase,
    FetchProductVariantUseCase,
  ],
})
export class HttpModule {}
