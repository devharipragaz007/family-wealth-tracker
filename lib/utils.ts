/**
 * Financial utility functions for wealth tracking
 */

/**
 * Safe division function that handles division by zero
 * @param dividend - The number to divide
 * @param divisor - The number to divide by
 * @param defaultValue - Default value to return if divisor is zero
 * @returns The division result or default value
 */
export function safeDivide(dividend: number, divisor: number, defaultValue: number = 0): number {
  if (divisor === 0) {
    return defaultValue;
  }
  return dividend / divisor;
}

/**
 * Calculate XIRR (Extended Internal Rate of Return)
 * Uses Newton-Raphson method to find the rate that makes NPV = 0
 * @param cashflows - Array of cash flow amounts (negative for outflows, positive for inflows)
 * @param dates - Array of corresponding dates
 * @param guess - Initial guess for the rate (default: 0.1 = 10%)
 * @returns XIRR as decimal (e.g., 0.15 = 15%)
 */
export function calculateXIRR(cashflows: number[], dates: Date[], guess: number = 0.1): number {
  if (cashflows.length !== dates.length) {
    throw new Error('Cashflows and dates arrays must have the same length');
  }

  if (cashflows.length < 2) {
    throw new Error('At least 2 cashflows are required for XIRR calculation');
  }

  const maxIterations = 100;
  const tolerance = 1e-6;
  let rate = guess;
  
  const firstDate = dates[0];
  
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;
    
    for (let j = 0; j < cashflows.length; j++) {
      const daysDiff = (dates[j].getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
      const yearsDiff = daysDiff / 365;
      const factor = Math.pow(1 + rate, yearsDiff);
      
      npv += cashflows[j] / factor;
      dnpv -= cashflows[j] * yearsDiff / factor / (1 + rate);
    }
    
    if (Math.abs(npv) < tolerance) {
      return rate;
    }
    
    if (Math.abs(dnpv) < tolerance) {
      throw new Error('XIRR calculation failed: derivative too small');
    }
    
    rate = rate - npv / dnpv;
  }
  
  throw new Error('XIRR calculation failed to converge');
}

/**
 * Calculate maturity amount for Fixed Deposit
 * @param principal - Initial investment amount
 * @param rate - Annual interest rate (as decimal, e.g., 0.08 for 8%)
 * @param time - Time period in years
 * @param compoundingFrequency - Compounding frequency per year (1=annual, 4=quarterly, 12=monthly)
 * @returns Maturity amount
 */
export function calculateFDMaturity(
  principal: number, 
  rate: number, 
  time: number, 
  compoundingFrequency: number = 1
): number {
  return principal * Math.pow(1 + rate / compoundingFrequency, compoundingFrequency * time);
}

/**
 * Calculate maturity amount for Recurring Deposit
 * @param monthlyAmount - Monthly deposit amount
 * @param rate - Annual interest rate (as decimal, e.g., 0.08 for 8%)
 * @param months - Total number of months
 * @returns Maturity amount
 */
export function calculateRDMaturity(monthlyAmount: number, rate: number, months: number): number {
  const monthlyRate = rate / 12;
  let maturityAmount = 0;
  
  for (let i = 1; i <= months; i++) {
    const remainingMonths = months - i + 1;
    maturityAmount += monthlyAmount * Math.pow(1 + monthlyRate, remainingMonths);
  }
  
  return maturityAmount;
}

/**
 * Calculate EMI (Equated Monthly Installment)
 * @param principal - Loan amount
 * @param rate - Annual interest rate (as decimal, e.g., 0.12 for 12%)
 * @param tenure - Loan tenure in months
 * @returns Monthly EMI amount
 */
export function calculateEMI(principal: number, rate: number, tenure: number): number {
  const monthlyRate = rate / 12;
  
  if (monthlyRate === 0) {
    return principal / tenure;
  }
  
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) / 
              (Math.pow(1 + monthlyRate, tenure) - 1);
  
  return emi;
}

/**
 * Calculate present value of future cash flows
 * @param futureValue - Future value to discount
 * @param rate - Discount rate (as decimal)
 * @param periods - Number of periods
 * @returns Present value
 */
export function calculatePresentValue(futureValue: number, rate: number, periods: number): number {
  return futureValue / Math.pow(1 + rate, periods);
}

/**
 * Calculate future value of present amount
 * @param presentValue - Present value to compound
 * @param rate - Growth rate (as decimal)
 * @param periods - Number of periods
 * @returns Future value
 */
export function calculateFutureValue(presentValue: number, rate: number, periods: number): number {
  return presentValue * Math.pow(1 + rate, periods);
}

/**
 * Calculate Simple Interest
 * @param principal - Principal amount
 * @param rate - Annual interest rate (as decimal)
 * @param time - Time period in years
 * @returns Interest amount
 */
export function calculateSimpleInterest(principal: number, rate: number, time: number): number {
  return principal * rate * time;
}

/**
 * Calculate Compound Interest
 * @param principal - Principal amount
 * @param rate - Annual interest rate (as decimal)
 * @param time - Time period in years
 * @param compoundingFrequency - Compounding frequency per year
 * @returns Interest amount
 */
export function calculateCompoundInterest(
  principal: number, 
  rate: number, 
  time: number, 
  compoundingFrequency: number = 1
): number {
  const amount = calculateFDMaturity(principal, rate, time, compoundingFrequency);
  return amount - principal;
}

/**
 * Calculate SIP (Systematic Investment Plan) maturity amount
 * @param monthlyAmount - Monthly SIP amount
 * @param rate - Expected annual return rate (as decimal)
 * @param months - Investment tenure in months
 * @returns Maturity amount
 */
export function calculateSIPMaturity(monthlyAmount: number, rate: number, months: number): number {
  const monthlyRate = rate / 12;
  
  if (monthlyRate === 0) {
    return monthlyAmount * months;
  }
  
  const maturityAmount = monthlyAmount * 
    ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate);
  
  return maturityAmount;
}

/**
 * Format currency value for display
 * @param amount - Amount to format
 * @param currency - Currency code (default: 'INR')
 * @param locale - Locale for formatting (default: 'en-IN')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number, 
  currency: string = 'INR', 
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format percentage for display
 * @param value - Decimal value to format as percentage (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Calculate portfolio allocation percentage
 * @param assetValue - Value of specific asset
 * @param totalValue - Total portfolio value
 * @returns Allocation percentage as decimal
 */
export function calculateAllocation(assetValue: number, totalValue: number): number {
  return safeDivide(assetValue, totalValue, 0);
}

/**
 * Calculate year-over-year growth rate
 * @param currentValue - Current period value
 * @param previousValue - Previous period value
 * @returns Growth rate as decimal
 */
export function calculateYoYGrowth(currentValue: number, previousValue: number): number {
  if (previousValue === 0) {
    return currentValue > 0 ? 1 : 0; // 100% growth if starting from 0
  }
  return (currentValue - previousValue) / previousValue;
}

/**
 * Calculate portfolio standard deviation (risk measure)
 * @param returns - Array of periodic returns
 * @returns Standard deviation of returns
 */
export function calculateStandardDeviation(returns: number[]): number {
  if (returns.length === 0) return 0;
  
  const mean = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const variance = returns.reduce((sum, ret) => sum + Math.pow(ret - mean, 2), 0) / returns.length;
  
  return Math.sqrt(variance);
}

/**
 * Calculate Sharpe ratio (risk-adjusted return)
 * @param portfolioReturn - Portfolio return (as decimal)
 * @param riskFreeRate - Risk-free rate (as decimal)
 * @param standardDeviation - Portfolio standard deviation
 * @returns Sharpe ratio
 */
export function calculateSharpeRatio(
  portfolioReturn: number, 
  riskFreeRate: number, 
  standardDeviation: number
): number {
  return safeDivide(portfolioReturn - riskFreeRate, standardDeviation, 0);
}
