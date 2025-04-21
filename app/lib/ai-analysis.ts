import OpenAI from 'openai'
import { calculateSalaryMetrics } from './salary-calculations'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  // TODO: BE CAREFUL WITH THIS
  dangerouslyAllowBrowser: true // Allow OpenAI to run in the browser, obviously not meant for production
})

// Development flag to disable AI analysis
const DISABLE_AI = false;

export async function analyzeData(
  occupationName: string,
  quarters: string[],
  salaries: number[]
): Promise<string> {
  const { yoyGrowth, yoyAbsolute, avgQuarterlyGrowth, realGrowth, inflationRate } = 
    calculateSalaryMetrics(quarters, salaries)
  if (DISABLE_AI) {

    return `[AI Analüüs on välja lülitatud] Analüüs ametile "${occupationName}":
    
Keskmine palk on ${salaries[salaries.length - 1]}€, mis on ${yoyAbsolute.toFixed(0)}€ rohkem kui ${quarters[0]} (${salaries[0]}€).

Palk on tõusnud ${yoyGrowth.toFixed(1)}% ajavahemikul ${quarters[0]} - ${quarters[quarters.length - 1]}.
Keskmine kvartali kasv on ${avgQuarterlyGrowth.toFixed(1)}%, reaalne kasv (inflatsioon ${inflationRate}%) on ${realGrowth.toFixed(1)}%.`
  }

  try {
    const metricsData = [
      `Aastane kasv: ${yoyAbsolute.toFixed(1)}€ (${yoyGrowth.toFixed(1)}%)`,
      `Keskmine kvartali kasv: ${avgQuarterlyGrowth.toFixed(1)}%`,
      `Reaalne kasv: ${realGrowth.toFixed(1)}%`
    ].join('\n')

    const prompt = `You are an expert in salary analysis and will be responding in Estonian.

Important: In your response, you must use colored tags to highlight specific data points. Use these tags exactly as follows:
- Wrap "Aastane kasv" data in <blue> ... </blue>
- Wrap "Keskmine kvartali kasv" data in <orange> ... </orange>
- Wrap "Reaalne kasv" data in <purple> ... </purple>

These tags must be included **in the body of your natural Estonian explanation**, not as separate lines. Write it as if you're naturally explaining the data in a report or article, but use the color tags when you mention the relevant metrics.

Here is an example of how to format:
Õige lause: <blue>Aastane kasv on 149.0€ (8.5%)</blue>, mis viitab märkimisväärsele tõusule.

Now analyze the following salary data for the occupation "${occupationName}":

Quarters of the data: ${quarters.join(', ')}
Average salary per quarter: ${salaries.join(', ')}€

Here is the data you must highlight with colored tags when referenced:
${metricsData}

###

Provide a brief overview of salary dynamics, trends (do you see it growing or shrinking), and potential causes. Also provide some tips on how to improve your salary in this field. The response should be in Estonian and approximately 3-4 paragraphs long.`

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    })

    return completion.choices[0].message.content || "Analüüsi ei õnnestunud genereerida."
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw new Error("Failed to generate analysis")
  }
} 