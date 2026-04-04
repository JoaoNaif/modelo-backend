import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
} from '@nestjs/common'
import { CreateProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/create-product-variant'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'

const createProductVariantBodySchema = z.object({
  name: z.string(),
  productId: z.string(),
  sku: z.string(),
  costPrice: z.number(),
  originalPrice: z.number().nullable(),
  salePrice: z.number(),
  installments: z.number().nullable(),
  hasInterest: z.boolean().optional(),
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
    const {
      name,
      productId,
      sku,
      costPrice,
      originalPrice,
      salePrice,
      installments,
      hasInterest,
    } = body

    const result = await this.createProductVariantUseCase.execute({
      name,
      productId,
      sku,
      costPrice,
      originalPrice,
      salePrice,
      installments,
      hasInterest,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistError:
          throw new ConflictException(error.message)
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      productVariant: result.value.productVariant,
    }
  }
}
