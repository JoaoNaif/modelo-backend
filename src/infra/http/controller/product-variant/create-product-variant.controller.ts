import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CreateProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/create-product-variant'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

const createProductVariantBodySchema = z.object({
  name: z.string(),
  productId: z.string(),
  sku: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductVariantBodySchema)

type CreateProductVariantBodySchema = z.infer<
  typeof createProductVariantBodySchema
>

@Controller()
export class CreateProductVariantController {
  constructor(
    private createProductVariantUseCase: CreateProductVariantUseCase
  ) {}

  @Post('product-variants')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateProductVariantBodySchema) {
    const { name, productId, sku } = body

    const result = await this.createProductVariantUseCase.execute({
      name,
      productId,
      sku,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new Error('Unexpected error')
      }
    }

    return {
      productVariant: result.value.productVariant,
    }
  }
}
