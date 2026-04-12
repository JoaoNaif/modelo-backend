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
import { CreateAttributeUseCase } from 'src/domain/main/app/attribute/use-cases/create-attribute'
import { ResourceAlreadyExistError } from 'src/core/error/err/resource-already-exist'

const createAttributeBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createAttributeBodySchema)

type CreateAttributeBodySchema = z.infer<typeof createAttributeBodySchema>

@Controller()
export class CreateAttributeController {
  constructor(private createAttributeUseCase: CreateAttributeUseCase) {}

  @Post('attributes')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAttributeBodySchema) {
    const { name } = body

    const result = await this.createAttributeUseCase.execute({
      name,
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
      attribute: result.value.attribute,
    }
  }
}
