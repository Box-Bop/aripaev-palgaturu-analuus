export interface Variable {
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