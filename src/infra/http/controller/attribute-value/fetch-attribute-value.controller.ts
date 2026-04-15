import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Param,
} from '@nestjs/common'
import { FetchAttributeValueUseCase } from 'src/domain/main/app/attribute-value/use-cases/fetch-attribute-value'

@Controller()
export class FetchAttributeValueController {
  constructor(private fetchAttributeValueUseCase: FetchAttributeValueUseCase) {}

  @Get('attributes-values/:attributeId')
  @HttpCode(200)
  async handle(@Param('attributeId') attributeId: string) {
    const result = await this.fetchAttributeValueUseCase.execute({
      attributeId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      attributesValue: result.value.attributesValue,
    }
  }
}
