import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { FetchAttributeUseCase } from 'src/domain/main/app/attribute/use-cases/fetch-attribute'

const queryParamSchema = z.string().optional()

@Controller()
export class FetchAttributeController {
  constructor(private fetchAttributeUseCase: FetchAttributeUseCase) {}

  @Get('attributes')
  @HttpCode(200)
  async handle(
    @Query('search', new ZodValidationPipe(queryParamSchema)) search: string
  ) {
    const result = await this.fetchAttributeUseCase.execute({
      search: search,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      attributes: result.value.attributes,
    }
  }
}
