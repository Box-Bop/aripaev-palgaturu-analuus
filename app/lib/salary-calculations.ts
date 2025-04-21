import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react"

export interface SalaryMetric {
  description: string
  title: string
  footer: {
    trend: {
      icon: LucideIcon
      text: string
    }
    period: string
  }
  value: number
  percentage: number
}

export interface SalaryCalculations {
  metrics: SalaryMetric[]
  yoyGrowth: number
  yoyAbsolute: number
  avgQuarterlyGrowth: number
  realGrowth: number
  inflationRate: number
}

export function calculateSalaryMetrics(
  quarters: string[],
  salaries: number[]
): SalaryCalculations {
  const lastQuarter = salaries[salaries.length - 1]
  const lastYearQuarter = salaries[salaries.length - 5]
  const yoyGrowth = ((lastQuarter - lastYearQuarter) / lastYearQuarter) * 100
  const yoyAbsolute = lastQuarter - lastYearQuarter

  const inflationRate = 3.2

  const quarterlyGrowthRates = []
  for (let i = 1; i < salaries.length; i++) {
    const growth = ((salaries[i] - salaries[i-1]) / salaries[i-1]) * 100
    quarterlyGrowthRates.push(growth)
  }
  const avgQuarterlyGrowth = quarterlyGrowthRates.reduce((a, b) => a + b, 0) / quarterlyGrowthRates.length
  const realGrowth = avgQuarterlyGrowth - inflationRate

  const metrics: SalaryMetric[] = [
    {
      description: "Aastane kasv",
      title: `${yoyAbsolute.toFixed(0)}€`,
      footer: {
        trend: {
          icon: yoyGrowth > 0 ? TrendingUp : TrendingDown,
          text: `${yoyGrowth > 0 ? "Kasvab" : "Langub"} ${yoyGrowth.toFixed(1)}% võrreldes eelmise aastaga`
        },
        period: `${quarters[quarters.length - 5]} vs ${quarters[quarters.length - 1]}`
      },
      value: yoyAbsolute,
      percentage: yoyGrowth
    },
    {
      description: "Keskmine kvartali kasv",
      title: `${avgQuarterlyGrowth.toFixed(1)}%`,
      footer: {
        trend: {
          icon: avgQuarterlyGrowth > 0 ? TrendingUp : TrendingDown,
          text: `${avgQuarterlyGrowth > 0 ? "Stabiilne kasv" : "Langus"} ${avgQuarterlyGrowth.toFixed(1)}% kvartalite kaupa`
        },
        period: `${quarters.length} kvartali keskmine`
      },
      value: avgQuarterlyGrowth,
      percentage: avgQuarterlyGrowth
    },
    {
      description: "Reaalne kasv",
      title: `${realGrowth.toFixed(1)}%`,
      footer: {
        trend: {
          icon: realGrowth > 0 ? TrendingUp : TrendingDown,
          text: `${realGrowth > 0 ? "Positiivne" : "Negatiivne"} reaalne kasv (inflatsioon ${inflationRate}%)`
        },
        period: "Inflatsiooni arvestatud kasv"
      },
      value: realGrowth,
      percentage: realGrowth
    }
  ]

  return {
    metrics,
    yoyGrowth,
    yoyAbsolute,
    avgQuarterlyGrowth,
    realGrowth,
    inflationRate
  }
} 