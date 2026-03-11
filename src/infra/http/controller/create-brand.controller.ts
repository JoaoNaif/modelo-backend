import z from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'
import { CreateBrandUseCase } from 'src/domain/main/app/brand/use-cases/create-brand'
import { BrandAlreadyExistError } from 'src/domain/main/app/brand/errors/brand-already-exist-error'

const createBrandBodySchema = z.object({
  name: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createBrandBodySchema)

type CreateBrandBodySchema = z.infer<typeof createBrandBodySchema>

@Controller()
export class CreateBrandController {
  constructor(private createBrandUseCase: CreateBrandUseCase) {}

  @Post('brands')
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateBrandBodySchema) {
    const { name } = body

    const result = await this.createBrandUseCase.execute({
      name,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case BrandAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      brand: result.value.brand,
    }
  }
}
