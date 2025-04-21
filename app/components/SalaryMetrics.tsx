"use client"

import { TrendingUp, TrendingDown, Percent, LucideIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { calculateSalaryMetrics, type SalaryMetric } from "@/app/lib/salary-calculations"
import { cn } from "@/lib/utils"

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
  color: 'blue' | 'orange' | 'purple'
}

function MetricCard({ description, title, footer, color }: MetricCardProps) {
  const TrendIcon = footer.trend.icon

  const colorStyles = {
    blue: 'bg-blue-100/80 dark:bg-blue-900/80 shadow-blue-300/50 dark:shadow-blue-800/50',
    orange: 'bg-orange-100/80 dark:bg-orange-900/80 shadow-orange-300/50 dark:shadow-orange-800/50',
    purple: 'bg-purple-100/80 dark:bg-purple-900/80 shadow-purple-300/50 dark:shadow-purple-800/50'
  }

  return (
    <Card className={cn(
      "shadow-lg transition-shadow hover:shadow-xl",
      colorStyles[color]
    )}>
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

  const { metrics } = calculateSalaryMetrics(quarters, salaries)

  const colors: ('blue' | 'orange' | 'purple')[] = ['blue', 'orange', 'purple']

  return (
    <div className="grid grid-cols-3 gap-4 mt-8 w-[800px]">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={index} 
          {...metric} 
          color={colors[index]}
        />
      ))}
    </div>
  )
} 