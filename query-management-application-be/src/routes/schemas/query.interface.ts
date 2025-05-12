export interface IQuery {
  id: string
  title: string
  description: string
  status: string
  formDataId: string
  }

export interface ICountedQuery {
  total: number
  query: IQuery[]
}