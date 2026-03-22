import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CreateProductUseCase } from 'src/domain/main/app/product/use-cases/create-product'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

const createProductBodySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  isActive: z.boolean().default(true),
  brandId: z.string(),
  categoryId: z.string().nullable(),
})

const bodyValidationPipe = new ZodValidationPipe(createProductBodySchema)

type CreateProductBodySchema = z.infer<typeof createProductBodySchema>

@Controller()
export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  @Post('products')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateProductBodySchema) {
    const { name, description, isActive, brandId, categoryId } = body

    const result = await this.createProductUseCase.execute({
      name,
      description,
      isActive,
      brandId,
      categoryId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      product: result.value.product,
    }
  }
}
