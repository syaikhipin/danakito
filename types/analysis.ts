export interface InvestmentAnalysisResponse {
  score: number
  market: string
  risk: string
  roi: string
  recommendation: string
  detailedAnalysis: string
  creditComparison: BankCreditOption[]
  source?: 'gemini' | 'mock'
  
  // Optional detailed report fields
  mobilityAnalysis?: {
    summary: string
    data: { label: string; value: number }[]
  }
  spendingAnalysis?: {
    summary: string
    data: { label: string; value: number }[]
  }
  opportunityAnalysis?: {
    summary: string
    data: { label: string; value: number }[]
  }
  riskFactors?: {
    factor: string
    level: 'Low' | 'Medium' | 'High'
    description: string
  }[]
  mitigationStrategies?: {
    title: string
    description: string
  }[]
}

export interface BankCreditOption {
  bankName: string
  interestRate: number
  monthlyPayment: number
  totalPayment: number
  processingFee: number
  requirements: string[]
  pros: string[]
  cons: string[]
} 