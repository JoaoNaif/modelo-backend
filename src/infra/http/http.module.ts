import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CreateBrandController } from './controller/create-brand.controller'
import { CreateBrandUseCase } from 'src/domain/main/app/brand/use-cases/create-brand'

@Module({
  imports: [DatabaseModule],
  controllers: [CreateBrandController],
  providers: [CreateBrandUseCase],
})
export class HttpModule {}
