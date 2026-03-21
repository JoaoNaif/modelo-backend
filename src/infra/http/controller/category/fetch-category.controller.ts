import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
  Query,
} from '@nestjs/common'
import { FetchCategoryUseCase } from 'src/domain/main/app/category/use-cases/fetch-category'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const queryParamSchema = z.string().optional()

@Controller()
export class FetchCategoryController {
  constructor(private fetchCategoryUseCase: FetchCategoryUseCase) {}

  @Get('categories')
  @HttpCode(200)
  async handle(
    @Query('search', new ZodValidationPipe(queryParamSchema)) search: string
  ) {
    const result = await this.fetchCategoryUseCase.execute({
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
      categories: result.value.categories,
    }
  }
}
