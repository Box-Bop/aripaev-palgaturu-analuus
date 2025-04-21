"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analyzeData } from "@/app/lib/ai-analysis"
import { ColoredAnalysis } from "./ColoredAnalysis"

interface SalaryAnalysisProps {
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

export function SalaryAnalysis({ data }: SalaryAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getAnalysis() {
      try {
        setIsLoading(true)
        const occupationName = Object.values(data.dimension.Tegevusala.category.label)[0]
        const quarters = Object.values(data.dimension.Vaatlusperiood.category.label)
        const salaries = data.value

        const result = await analyzeData(occupationName, quarters, salaries)
        setAnalysis(result)
      } catch (error) {
        console.error("Failed to get analysis:", error)
        setAnalysis("Analüüsi ei õnnestunud genereerida.")
      } finally {
        setIsLoading(false)
      }
    }

    getAnalysis()
  }, [data])

  return (
    <Card className="mt-8 w-[800px]">
      <CardHeader>
        <CardTitle>AI Analüüs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        ) : (
          <ColoredAnalysis text={analysis} />
        )}
      </CardContent>
    </Card>
  )
} 