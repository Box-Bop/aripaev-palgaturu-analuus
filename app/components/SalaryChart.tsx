"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface SalaryChartProps {
  data: {
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
}

export function SalaryChart({ data }: SalaryChartProps) {
  // Transform the data into the format needed for the chart
  const chartData = data.value.map((value, index) => {
    const quarter = Object.keys(data.dimension.Vaatlusperiood.category.label)[index]
    return {
      quarter: data.dimension.Vaatlusperiood.category.label[quarter],
      salary: value,
    }
  })

  const occupationName = Object.values(data.dimension.Tegevusala.category.label)[0]
  const firstQuarter = chartData[0].quarter
  const lastQuarter = chartData[chartData.length - 1].quarter

  const chartConfig = {
    salary: {
      label: "Keskmine brutokuupalk (€)",
      theme: {
        light: "hsl(215 50% 23%)",  // Deep blue for light mode
        dark: "hsl(217 91% 60%)",   // Bright blue for dark mode
      },
    },
  } satisfies ChartConfig

  return (
    <Card className="mt-8 w-[800px]">
      <CardHeader>
        <CardTitle>{occupationName}</CardTitle>
        <CardDescription>
          Andmed ajavahemikul {firstQuarter} kuni {lastQuarter}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-salary)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-salary)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}€`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="salary"
              type="monotone"
              stroke="var(--color-salary)"
              strokeWidth={2}
              fill="url(#salaryGradient)"
              dot={false}
              name="salary-gradient"
            />
            <Area
              dataKey="salary"
              type="monotone"
              stroke="var(--color-salary)"
              strokeWidth={2}
              fill="none"
              dot={{ fill: "var(--color-salary)", r: 4 }}
              name="salary-dots"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
} 