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
import { MulterModule } from '@nestjs/platform-express'
import { UploadAndCreateAttachmentController } from './controller/product-image/upload-and-create-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from 'src/domain/main/app/product-image/use-cases/upload-and-create-attachment'
import { CreateProductSectionController } from './controller/product-section/create-product-section.controller'
import { CreateProductSectionUseCase } from 'src/domain/main/app/product-section/use-cases/create-product-section'
import { FetchProductSectionController } from './controller/product-section/fetch-product-section.controller'
import { FetchProductSectionUseCase } from 'src/domain/main/app/product-section/use-cases/fetch-product-section'
import { CreateAttributeController } from './controller/attribute/create-attribute.controller'
import { CreateAttributeUseCase } from 'src/domain/main/app/attribute/use-cases/create-attribute'

@Module({
  imports: [
    DatabaseModule,
    MulterModule.register({
      storage: undefined,
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  ],
  controllers: [
    CreateBrandController,
    GetBrandController,
    CreateCategoryController,
    FetchCategoryController,
    CreateProductController,
    FetchProductController,
    CreateProductVariantController,
    FetchProductVariantController,
    CreateProductSectionController,
    FetchProductSectionController,
    CreateAttributeController,
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
    CreateProductSectionUseCase,
    FetchProductSectionUseCase,
    CreateAttributeUseCase,
  ],
})
export class HttpModule {}
