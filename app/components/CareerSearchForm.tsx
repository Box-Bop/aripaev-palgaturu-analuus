"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Check, ChevronsUpDown } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

// Dummy data - in real app this would come from API
const jobs = [
  { label: "Software Developer", value: "dev" },
  { label: "Project Manager", value: "pm" },
  { label: "Data Analyst", value: "analyst" },
  { label: "Marketing Specialist", value: "marketing" },
  { label: "Sales Representative", value: "sales" },
  { label: "HR Manager", value: "hr" },
  { label: "Accountant", value: "accountant" },
  { label: "Customer Service", value: "cs" },
] as const

const FormSchema = z.object({
  job: z.string({
    required_error: "Please select a job.",
  }),
})

export function JobCombobox() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast("Selected job:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="job"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Amet</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[300px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? jobs.find(
                            (job) => job.value === field.value
                          )?.label
                        : "Vali amet"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
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
              <FormDescription>
                Vali amet, mille kohta soovid palgauuringut teha.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Jätka</Button>
      </form>
    </Form>
  )
} 