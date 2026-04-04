export interface DtoGetProductPrice {
  id: string
  variantId: string
  costPrice: number
  originalPrice: number | null
  salePrice: number
  installments: number | null
  hasInterest: boolean
  createdAt: Date
  updatedAt?: Date | null
}
