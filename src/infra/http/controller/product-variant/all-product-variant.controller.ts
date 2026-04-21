import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { AllProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/all-product-variant'

const queryParamSchema = z.string()

@Controller()
export class AllProductVariantController {
  constructor(private allProductVariantUseCase: AllProductVariantUseCase) {}

  @Get('all-product-variants/:productId')
  @HttpCode(200)
  async handle(
    @Param('productId', new ZodValidationPipe(queryParamSchema))
    productId: string
  ) {
    const result = await this.allProductVariantUseCase.execute({
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
