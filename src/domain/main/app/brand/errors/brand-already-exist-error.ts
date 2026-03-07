import { UseCaseError } from 'src/core/error/use-case-error'

export class BrandAlreadyExistError extends Error implements UseCaseError {
  constructor(name: string) {
    super(`Brand ${name} already exists`)
  }
}
