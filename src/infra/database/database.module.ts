import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { BrandRepository } from 'src/domain/main/app/_repositories/brand-repository'
import { PrismaBrandRepository } from './prisma/repositories/prisma-brand-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: BrandRepository,
      useClass: PrismaBrandRepository,
    },
  ],
  exports: [BrandRepository],
})
export class DatabaseModule {}
