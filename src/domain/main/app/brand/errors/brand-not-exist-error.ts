import { UseCaseError } from 'src/core/error/use-case-error'

export class BrandNotExistsError extends Error implements UseCaseError {
  constructor() {
    super(`Brand not exists`)
  }
}
