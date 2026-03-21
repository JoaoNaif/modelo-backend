import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { BrandRepository } from 'src/domain/main/app/_repositories/brand-repository'
import { PrismaBrandRepository } from './prisma/repositories/prisma-brand-repository'
import { PrismaCategoryRepository } from './prisma/repositories/prisma-category-repository'
import { CategoryRepository } from 'src/domain/main/app/_repositories/category-repository'

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
  ],
  exports: [BrandRepository, CategoryRepository],
})
export class DatabaseModule {}
