interface Variable {
  code: string
  text: string
  values: string[]
  valueTexts: string[]
  elimination?: boolean
  time?: boolean
}

export interface StatisticsResponse {
  title: string
  variables: Variable[]
}

export interface Job {
  label: string
  value: string
}

export interface CacheData {
  timestamp: number
  data: StatisticsResponse
}

export interface SalaryDataResponse {
  value: number[]
  dimension: {
    Vaatlusperiood: {
      category: {
        label: Record<string, string>
      }
    }
    Tegevusala: {
      category: {
        label: Record<string, string>
      }
    }
  }
} 