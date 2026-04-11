import { Injectable } from '@nestjs/common'
import { Uploader } from '../../_storage/uploader'
import { ProductImageRepository } from '../../_repositories/product-image-repository'
import { ProductImage } from '../../../enterprise/entities/product-image'
import { ProductRepository } from '../../_repositories/product-repository'
import { ProductVariantRepository } from '../../_repositories/product-variant-repository'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { Either, left, right } from 'src/core/either'
import { DtoGetProductImages } from '../dtos/dto-get-product-images'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error'

interface UploadAndCreateAttachmentRequest {
  fileName: string
  fileType: string
  body: Buffer
  productId: string
  variantId: string | null
  title: string | null
  order: number
}

type UploadAndCreateAttachmentResponse = Either<
  InvalidAttachmentTypeError | ResourceNotFoundError,
  { productImages: DtoGetProductImages }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private productImageRepository: ProductImageRepository,
    private productRepository: ProductRepository,
    private productVariantRepository: ProductVariantRepository,
    private uploader: Uploader
  ) {}

  async execute({
    fileName,
    fileType,
    body,
    productId,
    variantId,
    title,
    order,
  }: UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      return left(new ResourceNotFoundError('Product not found'))
    }

    if (variantId) {
      const variant = await this.productVariantRepository.findById(variantId)

      if (!variant) {
        return left(new ResourceNotFoundError('Variant not found'))
      }
    }

    if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
      return left(new InvalidAttachmentTypeError(fileType))
    }

    const { url } = await this.uploader.upload({ fileName, fileType, body })

    const productImage = ProductImage.create({
      productId,
      variantId,
      title,
      url,
      order,
    })

    await this.productImageRepository.create(productImage)

    const productImages: DtoGetProductImages = {
      id: productImage.id.toString(),
      title: productImage.title,
      order: productImage.order,
      url: productImage.url,
      createdAt: productImage.createdAt,
    }

    return right({
      productImages,
    })
  }
}
