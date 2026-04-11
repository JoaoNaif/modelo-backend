import { InMemoryProductImageRepository } from 'test/repositories/in-memory-product-image-repository'
import { InMemoryProductRepository } from 'test/repositories/in-memory-product-repostiory'
import { InMemoryProductVariantRepository } from 'test/repositories/in-memory-product-variant-repository'
import { FakeUploader } from 'test/storage/fake-uploader'
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment'
import { makeProduct } from 'test/factories/make-prodcut'
import { makeProductVariant } from 'test/factories/make-product-variant'
import { ResourceNotFoundError } from 'src/core/error/err/not-found-error'
import { InvalidAttachmentTypeError } from '../errors/invalid-attachment-type-error'

let inMemoryProductImageRepository: InMemoryProductImageRepository
let inMemoryProductRepository: InMemoryProductRepository
let inMemoryProductVariantRepository: InMemoryProductVariantRepository
let fakeUploader: FakeUploader
let sut: UploadAndCreateAttachmentUseCase

describe('Upload and Create Attachment', () => {
  beforeEach(() => {
    inMemoryProductImageRepository = new InMemoryProductImageRepository()
    inMemoryProductRepository = new InMemoryProductRepository()
    inMemoryProductVariantRepository = new InMemoryProductVariantRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryProductImageRepository,
      inMemoryProductRepository,
      inMemoryProductVariantRepository,
      fakeUploader
    )
  })

  it('should be able to upload and create an attachment', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      productId: product.id.toString(),
      variantId: null,
      title: 'Profile Image',
      order: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      productImages: expect.objectContaining({
        title: 'Profile Image',
        order: 1,
      }),
    })
    expect(inMemoryProductImageRepository.items).toHaveLength(1)
    expect(inMemoryProductImageRepository.items[0].url).toEqual(expect.any(String))
  })

  it('should be able to upload and create an attachment for a variant', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)

    const variant = makeProductVariant({ productId: product.id.toString() })
    await inMemoryProductVariantRepository.create(variant)

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      productId: product.id.toString(),
      variantId: variant.id.toString(),
      title: 'Variant Image',
      order: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryProductImageRepository.items[0].variantId).toEqual(
      variant.id.toString()
    )
  })

  it('should not be able to upload with invalid file type', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
      productId: product.id.toString(),
      variantId: null,
      title: 'Invalid Image',
      order: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })

  it('should not be able to upload if product does not exist', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      productId: 'non-existing-id',
      variantId: null,
      title: 'Profile Image',
      order: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to upload if variant does not exist', async () => {
    const product = makeProduct()
    await inMemoryProductRepository.create(product)

    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
      productId: product.id.toString(),
      variantId: 'non-existing-variant-id',
      title: 'Profile Image',
      order: 1,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
