import { Job, StatisticsResponse } from "./types"

const CACHE_KEY = 'statistics_raw_response_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface CacheData {
  timestamp: number
  data: StatisticsResponse
}

export async function fetchJobs(): Promise<Job[]> {
  const cachedData = localStorage.getItem(CACHE_KEY)
  if (cachedData) {
    const { timestamp, data }: CacheData = JSON.parse(cachedData)
    const isExpired = Date.now() - timestamp > CACHE_DURATION
    
    if (!isExpired) {
      return processResponse(data)
    }
  }

  const response = await fetch(
    "https://andmed.stat.ee/api/v1/et/stat/PA111",
    {
      headers: {
        "Accept": "application/json",
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch jobs")
  }

  const data: StatisticsResponse = await response.json()

  const cacheData: CacheData = {
    timestamp: Date.now(),
    data: data,
  }
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))

  return processResponse(data)
}

function processResponse(data: StatisticsResponse): Job[] {
  const tegevusala = data.variables.find(v => v.code === "Tegevusala")
  
  if (!tegevusala) {
    throw new Error("Could not find Tegevusala data")
  }

  return tegevusala.valueTexts.map((label, index) => ({
    label,
    value: tegevusala.values[index],
  }))
} 