import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { location, investmentType, creditAmount, tenor, mobilityData, spendingData, opportunityData, generateDetailedReport } = body

  const geminiApiKey = config.geminiApiKey
  const geminiModel = config.geminiModel

  if (!geminiApiKey || !geminiModel) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Gemini API key or model not configured.'
    })
  }

  try {
    const prompt = generatePrompt(body)

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        tools: [
          { "google_search": {} }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: generateDetailedReport ? 4096 : 2048,
          responseMimeType: "application/json",
        }
      })
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Gemini API Error:', response.status, errorBody);
      throw new Error(`Gemini API error: ${response.status} - ${errorBody}`)
    }

    const data = await response.json()
    const aiResponse = data.candidates[0]?.content?.parts[0]?.text
    
    let analysisResult
    try {
      analysisResult = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError, aiResponse)
      return generateEnhancedMockResponse(body)
    }

    const creditComparison = generateBankCreditOptions(creditAmount, tenor)

    return {
      ...analysisResult,
      creditComparison
    }

  } catch (error) {
    console.error('Gemini API request failed:', error)
    return generateEnhancedMockResponse(body)
  }
})

function generatePrompt(requestData: any): string {
  const { location, investmentType, creditAmount, tenor, mobilityData, spendingData, opportunityData, generateDetailedReport } = requestData

  if (generateDetailedReport) {
    return `
You are an expert investment analyst. Analyze the following investment opportunity and provide a comprehensive, detailed analysis.

**Core Investment Details:**
- **Location:** ${location}
- **Investment Type:** ${investmentType}
- **Loan Amount:** ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(creditAmount)}
- **Loan Tenor:** ${tenor} months

**Local Area Data Points (Top 5 Nearby):**
- **Mobility Data (foot traffic intensity):** ${JSON.stringify(mobilityData, null, 2)}
- **Spending Data (average transaction amount):** ${JSON.stringify(spendingData, null, 2)}
- **Opportunity Data (investment viability score):** ${JSON.stringify(opportunityData, null, 2)}

Please provide a detailed analysis including the sections below. Your entire response must be a single, clean, raw JSON object, without any markdown formatting, comments, or other text outside the JSON structure.

**JSON Structure:**
{
  "score": "A number from 0-100 representing the overall investment score.",
  "market": "A brief summary of the market potential.",
  "risk": "A risk level assessment (e.g., Low, Medium, High).",
  "roi": "A string representing the projected annual ROI percentage (e.g., '12.5').",
  "recommendation": "A concise, data-driven recommendation.",
  "detailedAnalysis": "A comprehensive analysis in HTML format. Use p, ul, li, h3, and strong tags. Include sections for Market, Financial Projections, and Location.",
  "mobilityAnalysis": { "summary": "A brief text summary of the mobility data's impact on the investment.", "data": [{ "label": "Area 1", "value": 85 }] },
  "spendingAnalysis": { "summary": "A brief text summary of the spending patterns' impact on the investment.", "data": [{ "label": "Point 1", "value": 150 }] },
  "opportunityAnalysis": { "summary": "A brief text summary of the opportunity scores' impact on the investment.", "data": [{ "label": "Zone A", "value": 95 }] },
  "riskFactors": [ {"factor": "string", "level": "High/Medium/Low", "description": "string"} ],
  "mitigationStrategies": [ {"title": "string", "description": "string"} ]
}
`
  }
  
  return `
You are an expert investment analyst. Analyze the following investment opportunity:

Location: ${location}
Investment Type: ${investmentType}
Credit Amount: $${creditAmount.toLocaleString()}

Please provide:
1. Investment score (0-100)
2. Market potential assessment
3. Risk level analysis
4. ROI projections
5. Brief recommendation

Respond in JSON format with the following structure:
{
  "score": "number",
  "market": "string",
  "risk": "string", 
  "roi": "string",
  "recommendation": "string",
  "detailedAnalysis": "string"
}
`
}

function generateEnhancedMockResponse(requestData: any) {
  const { location, investmentType, creditAmount, tenor, generateDetailedReport } = requestData
  const score = Math.floor(Math.random() * 30) + 70 // 70-100%
  
  const baseResponse: any = {
    score,
    market: score > 85 ? 'Excellent Potential' : score > 70 ? 'High Potential' : 'Good Potential',
    risk: score > 85 ? 'Low' : score > 70 ? 'Low-Medium' : 'Medium',
    roi: `${(score * 0.12).toFixed(1)}`,
    recommendation: `${score > 80 ? 'Highly recommended' : score > 65 ? 'Recommended with caution' : 'Requires careful consideration'} investment opportunity in ${location} for ${investmentType}. Market analysis shows ${score > 80 ? 'strong' : 'moderate'} growth potential with manageable risk factors.`,
    creditComparison: generateBankCreditOptions(creditAmount, tenor),
    detailedAnalysis: `<h2>Mock Analysis Report</h2><p>This is mock data because the AI API call failed. Please check your API key and configuration.</p>`
  }
  
  if (generateDetailedReport) {
    baseResponse.mobilityAnalysis = { summary: 'Mock mobility summary.', data: [{ label: 'Area 1', value: 85 }, { label: 'Area 2', value: 72 }] };
    baseResponse.spendingAnalysis = { summary: 'Mock spending summary.', data: [{ label: 'Point 1', value: 150 }, { label: 'Point 2', value: 120 }] };
    baseResponse.opportunityAnalysis = { summary: 'Mock opportunity summary.', data: [{ label: 'Zone A', value: 95 }, { label: 'Zone B', value: 80 }] };
    baseResponse.riskFactors = [{ factor: "Market Competition", level: "Medium", description: "Mock competition analysis." }];
    baseResponse.mitigationStrategies = [{ title: "Market Diversification", description: "Mock mitigation strategy." }];
  }
  
  return baseResponse
}

function generateBankCreditOptions(amount: number, tenor: number) {
  const banks = [
    { name: 'Chase Business', baseRate: 7.5, fee: 0.02, requirements: ['Good credit score (700+)', 'Business plan', '2 years business history'], pros: ['Fast approval', 'Flexible terms', 'Business relationship'], cons: ['Higher interest rate', 'Strict requirements'] },
    { name: 'Wells Fargo SBA', baseRate: 6.8, fee: 0.015, requirements: ['Excellent credit (750+)', 'Collateral', 'SBA qualification'], pros: ['Lower interest rate', 'SBA backing', 'Long terms'], cons: ['Slow approval process', 'Lots of paperwork'] },
    { name: 'Bank of America', baseRate: 7.2, fee: 0.018, requirements: ['Good credit (720+)', 'Business bank account'], pros: ['Good online banking', 'Relationship discounts'], cons: ['Can be bureaucratic', 'Fees can add up'] },
    { name: 'Capital One Spark', baseRate: 8.0, fee: 0.01, requirements: ['Fair credit (670+)', 'No minimum revenue'], pros: ['Simple application', 'Good for new businesses'], cons: ['Higher rates for lower credit scores', 'Fewer physical branches'] }
  ]

  return banks.map(bank => {
    const interestRate = bank.baseRate + Math.random() * 0.5 - 0.25
    const monthlyRate = (interestRate / 100) / 12
    const processingFee = amount * bank.fee
    const monthlyPayment = amount * (monthlyRate * Math.pow(1 + monthlyRate, tenor)) / (Math.pow(1 + monthlyRate, tenor) - 1)
    const totalPayment = monthlyPayment * tenor

    return {
      bankName: bank.name,
      interestRate: parseFloat(interestRate.toFixed(2)),
      monthlyPayment: parseFloat(monthlyPayment.toFixed(2)),
      totalPayment: parseFloat(totalPayment.toFixed(2)),
      processingFee: parseFloat(processingFee.toFixed(2)),
      requirements: bank.requirements,
      pros: bank.pros,
      cons: bank.cons,
    }
  })
} 