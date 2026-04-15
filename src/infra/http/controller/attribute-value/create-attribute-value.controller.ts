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
import { CreateAttributeValueUseCase } from 'src/domain/main/app/attribute-value/use-cases/create-attribute-value'

const createAttributeValueBodySchema = z.object({
  value: z.string(),
  attributeId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createAttributeValueBodySchema)

type CreateAttributeValueBodySchema = z.infer<
  typeof createAttributeValueBodySchema
>

@Controller()
export class CreateAttributeValueController {
  constructor(
    private createAttributeValueUseCase: CreateAttributeValueUseCase
  ) {}

  @Post('attributes-values')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateAttributeValueBodySchema) {
    const { value, attributeId } = body

    const result = await this.createAttributeValueUseCase.execute({
      value,
      attributeId,
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
      attributeValue: result.value.attributeValue,
    }
  }
}
