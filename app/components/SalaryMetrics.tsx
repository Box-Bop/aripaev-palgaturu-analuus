"use client"

import { TrendingUp, TrendingDown, Percent, LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  description: string
  title: string
  footer: {
    trend: {
      icon: LucideIcon
      text: string
    }
    period: string
  }
}

function MetricCard({ description, title, footer }: MetricCardProps) {
  const TrendIcon = footer.trend.icon

  return (
    <Card>
      <CardHeader>
        <CardDescription>{description}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {title}
        </CardTitle>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          <TrendIcon className="size-4" />
          {footer.trend.text}
        </div>
        <div className="text-muted-foreground">
          {footer.period}
        </div>
      </CardFooter>
    </Card>
  )
}

interface SalaryMetricsProps {
  data: {
    value: number[]
    dimension: {
      Vaatlusperiood: {
        category: {
          label: Record<string, string>
        }
      }
    }
  }
}

export function SalaryMetrics({ data }: SalaryMetricsProps) {
  const quarters = Object.values(data.dimension.Vaatlusperiood.category.label)
  const salaries = data.value

  // Calculate metrics
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

  const metrics: MetricCardProps[] = [
    {
      description: "Aastane kasv",
      title: `${yoyAbsolute.toFixed(0)}€`,
      footer: {
        trend: {
          icon: yoyGrowth > 0 ? TrendingUp : TrendingDown,
          text: `${yoyGrowth > 0 ? "Kasvab" : "Langub"} ${yoyGrowth.toFixed(1)}% võrreldes eelmise aastaga`
        },
        period: `${quarters[quarters.length - 5]} vs ${quarters[quarters.length - 1]}`
      }
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
      }
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
      }
    }
  ]

  return (
    <div className="grid grid-cols-3 gap-4 mt-8 w-[800px]">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
} 