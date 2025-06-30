export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  const { location, investmentType, creditAmount, tenor, mobilityData, spendingData, opportunityData, generateDetailedReport } = body

  // Default to Gemini 2.0 Flash if not configured
  const geminiApiKey = config.geminiApiKey || process.env.GEMINI_API_KEY
  const geminiModel = config.geminiModel || process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp'

  console.log('🤖 Gemini API Config:', {
    hasApiKey: !!geminiApiKey,
    model: geminiModel,
    location,
    investmentType
  })

  if (!geminiApiKey) {
    console.warn('⚠️ Gemini API key not found, using mock data')
    return generateEnhancedMockResponse(body)
  }

  try {
    const prompt = generatePrompt(body)
    console.log('📝 Generated prompt for Gemini')

    const requestBody = {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: generateDetailedReport ? 4096 : 2048,
        responseMimeType: "application/json",
      }
    }

    console.log('🚀 Calling Gemini API...')
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('❌ Gemini API Error:', response.status, errorBody);
      console.log('🔄 Falling back to mock data due to API error')
      return generateEnhancedMockResponse(body)
    }

    const data = await response.json()
    console.log('✅ Gemini API response received')
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
    
    if (!aiResponse) {
      console.error('❌ No response text from Gemini')
      return generateEnhancedMockResponse(body)
    }

    let analysisResult
    try {
      // Clean the response in case it has markdown formatting
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim()
      analysisResult = JSON.parse(cleanResponse)
      console.log('✅ Successfully parsed Gemini response')
    } catch (parseError) {
      console.error('❌ Error parsing Gemini response:', parseError)
      console.log('Raw response:', aiResponse)
      return generateEnhancedMockResponse(body)
    }

    const creditComparison = generateBankCreditOptions(creditAmount, tenor)

    return {
      ...analysisResult,
      creditComparison,
      source: 'gemini' // Add source indicator
    }

  } catch (error) {
    console.error('❌ Gemini API request failed:', error)
    console.log('🔄 Falling back to mock data due to network error')
    return generateEnhancedMockResponse(body)
  }
})

function generatePrompt(requestData: any): string {
  const { location, investmentType, creditAmount, tenor, mobilityData, spendingData, opportunityData, generateDetailedReport } = requestData

  if (generateDetailedReport) {
    return `You are an expert investment analyst. Analyze this investment opportunity and provide a comprehensive analysis.

**Investment Details:**
- Location: ${location}
- Investment Type: ${investmentType}
- Loan Amount: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(creditAmount)}
- Loan Tenor: ${tenor} months

**Local Market Data:**
- Mobility Data: ${JSON.stringify(mobilityData, null, 2)}
- Spending Data: ${JSON.stringify(spendingData, null, 2)}
- Opportunity Data: ${JSON.stringify(opportunityData, null, 2)}

Respond with ONLY a clean JSON object (no markdown, no comments, no extra text) with this exact structure:

{
  "score": 85,
  "market": "Brief market assessment",
  "risk": "Low/Medium/High",
  "roi": "12.5",
  "recommendation": "Detailed recommendation",
  "detailedAnalysis": "<h3>Market Analysis</h3><p>Detailed analysis in HTML format...</p>",
  "mobilityAnalysis": {
    "summary": "Summary of mobility impact",
    "data": [{"label": "Area 1", "value": 85}, {"label": "Area 2", "value": 72}]
  },
  "spendingAnalysis": {
    "summary": "Summary of spending patterns",
    "data": [{"label": "Point 1", "value": 150}, {"label": "Point 2", "value": 120}]
  },
  "opportunityAnalysis": {
    "summary": "Summary of opportunity scores",
    "data": [{"label": "Zone A", "value": 95}, {"label": "Zone B", "value": 80}]
  },
  "riskFactors": [
    {"factor": "Market Competition", "level": "Medium", "description": "Analysis of competition"}
  ],
  "mitigationStrategies": [
    {"title": "Risk Mitigation", "description": "Strategy description"}
  ]
}`
  }
  
  return `You are an expert investment analyst. Analyze this investment opportunity:

Location: ${location}
Investment Type: ${investmentType}
Credit Amount: $${creditAmount.toLocaleString()}
Tenor: ${tenor} months

Provide analysis with score (0-100), market assessment, risk level, ROI projection, and recommendation.

Respond with ONLY a clean JSON object (no markdown, no extra text):

{
  "score": 85,
  "market": "Brief market potential assessment",
  "risk": "Low/Medium/High",
  "roi": "12.5",
  "recommendation": "Investment recommendation",
  "detailedAnalysis": "Detailed analysis text"
}`
}

function generateEnhancedMockResponse(requestData: any) {
  const { location, investmentType, creditAmount, tenor, generateDetailedReport } = requestData
  const score = Math.floor(Math.random() * 20) + 75 // 75-95%
  
  console.log('🎭 Generating enhanced mock response')
  
  const baseResponse: any = {
    score,
    market: score > 85 ? 'Excellent Market Potential' : score > 75 ? 'Strong Market Potential' : 'Good Market Potential',
    risk: score > 85 ? 'Low' : score > 75 ? 'Low-Medium' : 'Medium',
    roi: `${(score * 0.15 + 5).toFixed(1)}`,
    recommendation: `${score > 85 ? 'Highly recommended' : score > 75 ? 'Recommended' : 'Consider with caution'} investment opportunity in ${location} for ${investmentType}. Market analysis shows ${score > 85 ? 'strong' : 'moderate'} growth potential with well-manageable risk factors.`,
    detailedAnalysis: generateDetailedMockAnalysis(location, investmentType, score),
    source: 'mock' // Add source indicator
  }
  
  if (generateDetailedReport) {
    baseResponse.mobilityAnalysis = { 
      summary: `High foot traffic in ${location} with average mobility score of 78/100, indicating strong consumer presence.`, 
      data: [
        { label: 'Peak Hours (9-11 AM)', value: 92 }, 
        { label: 'Lunch Time (12-2 PM)', value: 85 },
        { label: 'Evening (5-7 PM)', value: 78 },
        { label: 'Weekend Average', value: 65 }
      ] 
    };
    baseResponse.spendingAnalysis = { 
      summary: `Average transaction value of $${Math.floor(120 + Math.random() * 80)} with strong purchasing power in the area.`, 
      data: [
        { label: 'Retail Spending', value: 165 }, 
        { label: 'Food & Dining', value: 142 },
        { label: 'Services', value: 108 },
        { label: 'Entertainment', value: 95 }
      ] 
    };
    baseResponse.opportunityAnalysis = { 
      summary: `Investment opportunity score of ${score}/100 based on market demand, competition, and growth potential.`, 
      data: [
        { label: 'Market Demand', value: score + 5 }, 
        { label: 'Competition Level', value: Math.max(60, score - 10) },
        { label: 'Growth Potential', value: score + 2 },
        { label: 'Location Value', value: score - 3 }
      ] 
    };
    baseResponse.riskFactors = [
      { factor: "Market Competition", level: score > 85 ? "Low" : "Medium", description: `${score > 85 ? 'Limited' : 'Moderate'} competition in the ${investmentType} sector.` },
      { factor: "Economic Conditions", level: "Low", description: "Stable economic environment supports business growth." },
      { factor: "Location Risk", level: score > 80 ? "Low" : "Medium", description: `${location} shows ${score > 80 ? 'strong' : 'good'} market fundamentals.` }
    ];
    baseResponse.mitigationStrategies = [
      { title: "Market Differentiation", description: `Focus on unique value proposition in ${investmentType} to stand out from competitors.` },
      { title: "Customer Retention", description: "Implement loyalty programs and excellent customer service to maintain market share." },
      { title: "Financial Management", description: "Maintain adequate cash flow and emergency reserves for market fluctuations." }
    ];
  }
  
  const creditComparison = generateBankCreditOptions(creditAmount, tenor)
  
  return {
    ...baseResponse,
    creditComparison
  }
}

function generateDetailedMockAnalysis(location: string, investmentType: string, score: number): string {
  return `<h3>Market Analysis</h3>
<p>The ${investmentType} market in ${location} demonstrates ${score > 85 ? 'exceptional' : score > 75 ? 'strong' : 'solid'} fundamentals with growing consumer demand and favorable economic conditions.</p>

<h3>Financial Projections</h3>
<ul>
<li><strong>Expected ROI:</strong> ${(score * 0.15 + 5).toFixed(1)}% annually</li>
<li><strong>Break-even period:</strong> ${score > 85 ? '18-24' : score > 75 ? '24-30' : '30-36'} months</li>
<li><strong>Market growth rate:</strong> ${(score * 0.08 + 3).toFixed(1)}% per year</li>
</ul>

<h3>Location Analysis</h3>
<p>${location} offers excellent accessibility and visibility for ${investmentType} businesses. The area benefits from strong demographics and growing economic activity.</p>

<h3>Risk Assessment</h3>
<p>Overall risk is assessed as <strong>${score > 85 ? 'Low' : score > 75 ? 'Low-Medium' : 'Medium'}</strong>. Key factors include market stability, competition levels, and economic conditions.</p>`
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