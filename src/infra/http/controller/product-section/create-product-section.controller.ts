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
import { CreateProductSectionUseCase } from 'src/domain/main/app/product-section/use-cases/create-product-section'
import { ProductSectionType } from 'src/domain/main/enterprise/entities/product-section'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

const createProductSectionBodySchema = z.object({
  productId: z.string(),
  type: z.enum(['BENEFITS', 'SPECIFICATIONS', 'COMPOSITION']),
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductSectionBodySchema)

type CreateProductSectionBodySchema = z.infer<
  typeof createProductSectionBodySchema
>

@Controller()
export class CreateProductSectionController {
  constructor(
    private createProductSectionUseCase: CreateProductSectionUseCase
  ) {}

  @Post('product-sections')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateProductSectionBodySchema) {
    const { productId, type, title, content } = body

    const result = await this.createProductSectionUseCase.execute({
      productId,
      type: type as ProductSectionType,
      title,
      content,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case ResourceAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      productSection: result.value.productSection,
    }
  }
}
