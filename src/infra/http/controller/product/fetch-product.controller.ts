import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import { FetchProductUseCase } from 'src/domain/main/app/product/use-cases/fetch-product'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const queryParamSchema = z.string().optional()

@Controller()
export class FetchProductController {
  constructor(private fetchProductUseCase: FetchProductUseCase) {}

  @Get('products')
  @HttpCode(200)
  async handle(
    @Query('search', new ZodValidationPipe(queryParamSchema)) search: string
  ) {
    const result = await this.fetchProductUseCase.execute({
      search: search,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      products: result.value.products,
    }
  }
}
