"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Job } from "@/app/lib/types"
import { fetchJobs, fetchSalaryData } from "@/app/lib/api"
import { SalaryChart } from "./SalaryChart"
import { SalaryAnalysis } from "./SalaryAnalysis"
import { SalaryMetrics } from "./SalaryMetrics"

const FormSchema = z.object({
  job: z.string({
    required_error: "Palun valige amet.",
  }),
})

export function JobCombobox() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [salaryData, setSalaryData] = useState<any>(null)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  useEffect(() => {
    async function loadJobs() {
      try {
        const fetchedJobs = await fetchJobs()
        setJobs(fetchedJobs)
        setError(null)
      } catch (err) {
        setError("Failed to load jobs. Please try again later.")
        console.error("Error loading jobs:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadJobs()
  }, [])

  function onSubmit(data: z.infer<typeof FormSchema>) {
    fetchSalaryData(data.job)
      .then(data => {
        setSalaryData(data)
      })
      .catch(err => {
        console.error("Error fetching salary data:", err)
        toast.error("Failed to fetch salary data")
      })
  }

  if (error) {
    return <div className="text-destructive">{error}</div>
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="job"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[400px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <span className="truncate">
                          {isLoading 
                            ? "Laeb ameteid..."
                            : field.value
                            ? jobs.find((job) => job.value === field.value)?.label
                            : "Vali amet"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput
                        placeholder="Otsi ametit..."
                        className="h-9"
                      />
                      <CommandList>
                        <CommandEmpty>Ametit ei leitud.</CommandEmpty>
                        <CommandGroup>
                          {jobs.map((job) => (
                            <CommandItem
                              value={job.label}
                              key={job.value}
                              onSelect={() => {
                                form.setValue("job", job.value)
                              }}
                            >
                              {job.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  job.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormDescription className="text-center">
                  Vali amet, mille kohta soovid palgauuringut teha.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>Jätka</Button>
        </form>
      </Form>
      {salaryData && (
        <>
          <SalaryChart data={salaryData} />
          <SalaryAnalysis data={salaryData} />
          <SalaryMetrics data={salaryData} />
        </>
      )}
    </div>
  )
} 