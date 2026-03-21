import z from 'zod'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { BrandNotExistsError } from 'src/domain/main/app/brand/errors/brand-not-exist-error'
import { GetBrandUseCase } from 'src/domain/main/app/brand/use-cases/get-brand'

const getBrandBodySchema = z.object({
  id: z.string(),
})

@Controller()
export class GetBrandController {
  constructor(private getBrandUseCase: GetBrandUseCase) {}

  @Get('brands/:brandId')
  @HttpCode(200)
  async handle(@Param('brandId') brandId: string) {
    const result = await this.getBrandUseCase.execute({
      id: brandId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case BrandNotExistsError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      brand: result.value.brand,
    }
  }
}
