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
import { AddAttributeInProductVariantUseCase } from 'src/domain/main/app/product-variant/use-cases/add-attribute-in-product-variant'

const addAttributeInProductVariantBodySchema = z.object({
  productVariantId: z.string(),
  attributeValueId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  addAttributeInProductVariantBodySchema
)

type AddAttributeInProductVariantBodySchema = z.infer<
  typeof addAttributeInProductVariantBodySchema
>

@Controller()
export class AddAttributeInProductVariantController {
  constructor(
    private addAttributeInProductVariantUseCase: AddAttributeInProductVariantUseCase
  ) {}

  @Post('product-variants/attributes')
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AddAttributeInProductVariantBodySchema
  ) {
    const { productVariantId, attributeValueId } = body

    const result = await this.addAttributeInProductVariantUseCase.execute({
      productVariantId,
      attributeValueId,
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
