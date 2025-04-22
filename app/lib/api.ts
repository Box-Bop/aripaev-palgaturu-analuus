import { Job, StatisticsResponse, CacheData, SalaryDataResponse } from "./types"

const CACHE_KEY = 'statistics_raw_response_cache'
const SALARY_CACHE_KEY = 'statistics_salary_cache'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export async function fetchJobs(): Promise<Job[]> {
  const cachedData = localStorage.getItem(CACHE_KEY)
  if (cachedData) {
    const { timestamp, data }: CacheData = JSON.parse(cachedData)
    if (Date.now() - timestamp <= CACHE_DURATION) {
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
  
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    timestamp: Date.now(),
    data
  }))

  return processResponse(data)
}

function processResponse(data: StatisticsResponse): Job[] {
  const tegevusala = data.variables.find(v => v.code === "Tegevusala")
  if (!tegevusala) throw new Error("Could not find Tegevusala data")

  return tegevusala.valueTexts.map((label, index) => ({
    label,
    value: tegevusala.values[index],
  }))
}

export async function fetchSalaryData(occupationCode: string): Promise<SalaryDataResponse> {
  const cachedSalaries = localStorage.getItem(SALARY_CACHE_KEY)
  if (cachedSalaries) {
    const salaryCache: Record<string, { timestamp: number, data: SalaryDataResponse }> = JSON.parse(cachedSalaries)
    const cachedData = salaryCache[occupationCode]
    
    if (cachedData && Date.now() - cachedData.timestamp <= CACHE_DURATION) {
      return cachedData.data
    }
  }

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

  const data: SalaryDataResponse = await response.json()
  
  const salaryCache = cachedSalaries ? JSON.parse(cachedSalaries) : {}
  salaryCache[occupationCode] = {
    timestamp: Date.now(),
    data
  }
  localStorage.setItem(SALARY_CACHE_KEY, JSON.stringify(salaryCache))

  return data
} 