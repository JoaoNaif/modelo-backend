import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateBrandController } from './controller/create-brand.controller'
import { CreateBrandUseCase } from 'src/domain/main/app/brand/use-cases/create-brand'
import { GetBrandController } from './controller/get-brand.controller'
import { GetBrandUseCase } from 'src/domain/main/app/brand/use-cases/get-user'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateBrandController, GetBrandController],
  providers: [CreateBrandUseCase, GetBrandUseCase],
})
export class HttpModule {}
