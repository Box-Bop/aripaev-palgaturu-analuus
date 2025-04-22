"use client"

import { Badge } from "@/components/ui/badge"

interface ColoredAnalysisProps {
  text: string
}

export function ColoredAnalysis({ text }: ColoredAnalysisProps) {
  const parts = text.split(/(<blue>.*?<\/blue>|<orange>.*?<\/orange>|<purple>.*?<\/purple>)/)

  return (
    <div className="prose prose-sm dark:prose-invert">
      {parts.map((part, index) => {
        if (part.startsWith('<blue>')) {
          return (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-900 px-2 py-0.5 text-sm"
            >
              {part.replace(/<\/?blue>/g, '')}
            </Badge>
          )
        }
        if (part.startsWith('<orange>')) {
          return (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-orange-100 text-orange-700 hover:bg-orange-100 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-900 px-2 py-0.5 text-sm"
            >
              {part.replace(/<\/?orange>/g, '')}
            </Badge>
          )
        }
        if (part.startsWith('<purple>')) {
          return (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-purple-100 text-purple-700 hover:bg-purple-100 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-900 px-2 py-0.5 text-sm"
            >
              {part.replace(/<\/?purple>/g, '')}
            </Badge>
          )
        }
        return <span key={index}>{part}</span>
      })}
    </div>
  )
} 