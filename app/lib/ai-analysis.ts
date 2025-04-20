import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  // TODO: BE CAREFUL WITH THIS
  dangerouslyAllowBrowser: true // Allow OpenAI to run in the browser, obviously not meant for production
})

// Development flag to disable AI analysis
const DISABLE_AI = true

export async function analyzeData(
  occupationName: string,
  quarters: string[],
  salaries: number[]
): Promise<string> {
  if (DISABLE_AI) {
    return `[AI Analüüs on välja lülitatud] Analüüs ametile "${occupationName}":
    
Keskmine palk on ${salaries[salaries.length - 1]}€, mis on ${salaries[salaries.length - 1] - salaries[0]}€ rohkem kui ${quarters[0]} (${salaries[0]}€).

Palk on tõusnud ${((salaries[salaries.length - 1] - salaries[0]) / salaries[0] * 100).toFixed(1)}% ajavahemikul ${quarters[0]} - ${quarters[quarters.length - 1]}.`
  }

  try {
    const prompt = `Analüüsi järgmisi palgaandmeid ametile "${occupationName}":

Kvartalid: ${quarters.join(', ')}
Palgad: ${salaries.join(', ')}€

Anna lühike ülevaade palgadünaamikast, trendidest ja võimalikest põhjustest. Vastus peaks olema eesti keeles ja umbes 2-3 lõiku pikk.`

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