import z from 'zod'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { UploadAndCreateAttachmentUseCase } from 'src/domain/main/app/product-image/use-cases/upload-and-create-attachment'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { InvalidAttachmentTypeError } from 'src/domain/main/app/product-image/errors/invalid-attachment-type-error'

const uploadBodySchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().nullable().optional(),
  title: z.string().nullable(),
  order: z.coerce.number().default(0),
})

const bodyValidationPipe = new ZodValidationPipe(uploadBodySchema)

type UploadBodySchema = z.infer<typeof uploadBodySchema>

@Controller()
export class UploadAndCreateAttachmentController {
  constructor(
    private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase
  ) {}

  @Post('/attachments')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile() file: Express.Multer.File,
    @Body(bodyValidationPipe) body: UploadBodySchema
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded')
    }

    const { productId, variantId, title, order } = body

    const result = await this.uploadAndCreateAttachment.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
      productId,
      variantId: variantId ?? null,
      title,
      order,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(error.message)
        case InvalidAttachmentTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException('Unexpected error')
      }
    }

    return {
      productImage: result.value.productImages,
    }
  }
}
