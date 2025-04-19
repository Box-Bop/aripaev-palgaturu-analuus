import { Job, StatisticsResponse } from "./types"

const CACHE_KEY = 'statistics_raw_response_cache'
const SALARY_CACHE_KEY = 'statistics_salary_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

interface CacheData {
  timestamp: number
  data: StatisticsResponse
}

interface SalaryCacheData {
  timestamp: number
  data: Record<string, any> // We'll type this properly later
}

interface SalaryCache {
  [occupationCode: string]: SalaryCacheData
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

export async function fetchSalaryData(occupationCode: string): Promise<any> {
  // Try to get cached salary data
  const cachedSalaries = localStorage.getItem(SALARY_CACHE_KEY)
  if (cachedSalaries) {
    const salaryCache: SalaryCache = JSON.parse(cachedSalaries)
    const cachedData = salaryCache[occupationCode]
    
    if (cachedData) {
      const isExpired = Date.now() - cachedData.timestamp > CACHE_DURATION
      if (!isExpired) {
        return cachedData.data
      }
    }
  }

  // If no cache or expired, fetch new data
  const response = await fetch(
    "https://andmed.stat.ee/api/v1/et/stat/PA111",
    {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: [
          {
            code: "Näitaja",
            selection: {
              filter: "item",
              values: ["GR_W_AVG"]
            }
          },
          {
            code: "Tegevusala",
            selection: {
              filter: "item",
              values: [occupationCode]
            }
          }
        ],
        response: {
          format: "json-stat2"
        }
      })
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch salary data")
  }

  const data = await response.json()

  // Update cache
  const salaryCache: SalaryCache = cachedSalaries ? JSON.parse(cachedSalaries) : {}
  salaryCache[occupationCode] = {
    timestamp: Date.now(),
    data: data
  }
  localStorage.setItem(SALARY_CACHE_KEY, JSON.stringify(salaryCache))

  return data
} 