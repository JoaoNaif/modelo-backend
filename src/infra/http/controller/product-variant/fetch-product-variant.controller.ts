import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { FetchProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/fetch-product-variant'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

const queryParamSchema = z.string()

@Controller()
export class FetchProductVariantController {
  constructor(private fetchProductVariantUseCase: FetchProductVariantUseCase) {}

  @Get('product-variants/:productId')
  @HttpCode(200)
  async handle(
    @Param('productId', new ZodValidationPipe(queryParamSchema))
    productId: string
  ) {
    const result = await this.fetchProductVariantUseCase.execute({
      productId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new Error('Unexpected error')
      }
    }

    return {
      productVariants: result.value.productVariants,
    }
  }
}
