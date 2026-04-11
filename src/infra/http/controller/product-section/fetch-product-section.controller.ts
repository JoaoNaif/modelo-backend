import { Controller, Get, HttpCode, Param } from '@nestjs/common'
import { FetchProductSectionUseCase } from 'src/domain/main/app/product-section/use-cases/fetch-product-section'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'

const queryParamSchema = z.string()

@Controller()
export class FetchProductSectionController {
  constructor(private fetchProductSectionUseCase: FetchProductSectionUseCase) {}

  @Get('product-sections/:productId')
  @HttpCode(200)
  async handle(
    @Param('productId', new ZodValidationPipe(queryParamSchema))
    productId: string
  ) {
    const result = await this.fetchProductSectionUseCase.execute({
      productId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ResourceNotFoundError('Product')
        default:
          throw new Error('Unexpected error')
      }
    }

    return {
      productSections: result.value.productSections,
    }
  }
}
