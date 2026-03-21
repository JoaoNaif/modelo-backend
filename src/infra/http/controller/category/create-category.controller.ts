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
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'
import { CreateCategoryUseCase } from 'src/domain/main/app/category/use-cases/create-category'

const createCategoryBodySchema = z.object({
  name: z.string(),
  parentId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller()
export class CreateCategoryController {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  @Post('categories')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateCategoryBodySchema) {
    const { name, parentId } = body

    const result = await this.createCategoryUseCase.execute({
      name,
      parentId,
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
      category: result.value.category,
    }
  }
}
