/**
 * Financial utility functions for the Family Wealth Tracker application
 * Provides safe mathematical operations and formatting for financial data
 */

// Types for financial calculations
export interface CurrencyOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export interface PortfolioMetrics {
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  dayGainLoss: number;
  dayGainLossPercentage: number;
}

export interface AssetData {
  currentValue: number;
  costBasis?: number;
  previousValue?: number;
  quantity?: number;
  currentPrice?: number;
  previousPrice?: number;
}

/**
 * Safely divides two numbers, returning 0 if divisor is 0 or invalid
 * @param dividend - The number to be divided
 * @param divisor - The number to divide by
 * @returns The division result or 0 if invalid
 */
export function safeDivide(dividend: number, divisor: number): number {
  // Handle null, undefined, or NaN values
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    return 0;
  }
  
  if (isNaN(dividend) || isNaN(divisor)) {
    return 0;
  }
  
  // Handle division by zero
  if (divisor === 0 || !isFinite(divisor)) {
    return 0;
  }
  
  const result = dividend / divisor;
  
  // Handle infinite or NaN results
  if (!isFinite(result) || isNaN(result)) {
    return 0;
  }
  
  return result;
}

/**
 * Rounds a number to specified decimal places
 * @param value - The number to round
 * @param decimals - Number of decimal places (default: 2)
 * @returns The rounded number
 */
export function roundToDecimals(value: number, decimals: number = 2): number {
  // Handle invalid inputs
  if (typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
    return 0;
  }
  
  if (typeof decimals !== 'number' || decimals < 0 || !Number.isInteger(decimals)) {
    decimals = 2;
  }
  
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Formats a number as currency
 * @param value - The number to format
 * @param options - Currency formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number, 
  options: CurrencyOptions = {}
): string {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
  } = options;
  
  // Handle invalid inputs
  if (typeof value !== 'number' || isNaN(value)) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(0);
  }
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);
  } catch (error) {
    // Fallback if Intl formatting fails
    const roundedValue = roundToDecimals(value, maximumFractionDigits);
    return `$${roundedValue.toLocaleString()}`;
  }
}

/**
 * Formats a number as a percentage
 * @param value - The decimal value to format (e.g., 0.15 for 15%)
 * @param decimals - Number of decimal places (default: 2)
 * @param options - Additional formatting options
 * @returns Formatted percentage string
 */
export function formatPercentage(
  value: number, 
  decimals: number = 2,
  options: { locale?: string; showSign?: boolean } = {}
): string {
  const { locale = 'en-US', showSign = true } = options;
  
  // Handle invalid inputs
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.00%';
  }
  
  const roundedValue = roundToDecimals(value * 100, decimals);
  
  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      signDisplay: showSign ? 'exceptZero' : 'auto'
    });
    
    return formatter.format(value);
  } catch (error) {
    // Fallback formatting
    const sign = showSign && roundedValue > 0 ? '+' : '';
    return `${sign}${roundedValue}%`;
  }
}

/**
 * Calculates portfolio metrics from an array of assets
 * @param assets - Array of asset data
 * @returns Portfolio metrics object
 */
export function calculatePortfolioMetrics(assets: AssetData[]): PortfolioMetrics {
  if (!Array.isArray(assets) || assets.length === 0) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalGainLoss: 0,
      totalGainLossPercentage: 0,
      dayGainLoss: 0,
      dayGainLossPercentage: 0
    };
  }
  
  let totalValue = 0;
  let totalCost = 0;
  let totalPreviousValue = 0;
  
  // Calculate totals
  assets.forEach(asset => {
    if (typeof asset.currentValue === 'number' && !isNaN(asset.currentValue)) {
      totalValue += asset.currentValue;
    }
    
    if (typeof asset.costBasis === 'number' && !isNaN(asset.costBasis)) {
      totalCost += asset.costBasis;
    }
    
    if (typeof asset.previousValue === 'number' && !isNaN(asset.previousValue)) {
      totalPreviousValue += asset.previousValue;
    } else if (typeof asset.quantity === 'number' && 
               typeof asset.previousPrice === 'number' && 
               !isNaN(asset.quantity) && !isNaN(asset.previousPrice)) {
      totalPreviousValue += asset.quantity * asset.previousPrice;
    }
  });
  
  // Calculate derived metrics
  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPercentage = safeDivide(totalGainLoss, totalCost);
  const dayGainLoss = totalValue - totalPreviousValue;
  const dayGainLossPercentage = safeDivide(dayGainLoss, totalPreviousValue);
  
  return {
    totalValue: roundToDecimals(totalValue),
    totalCost: roundToDecimals(totalCost),
    totalGainLoss: roundToDecimals(totalGainLoss),
    totalGainLossPercentage: roundToDecimals(totalGainLossPercentage, 4),
    dayGainLoss: roundToDecimals(dayGainLoss),
    dayGainLossPercentage: roundToDecimals(dayGainLossPercentage, 4)
  };
}

/**
 * Calculates the compound annual growth rate (CAGR)
 * @param beginningValue - Initial investment value
 * @param endingValue - Final investment value
 * @param periods - Number of years
 * @returns CAGR as a decimal (e.g., 0.15 for 15%)
 */
export function calculateCAGR(
  beginningValue: number,
  endingValue: number,
  periods: number
): number {
  if (typeof beginningValue !== 'number' || 
      typeof endingValue !== 'number' || 
      typeof periods !== 'number' ||
      beginningValue <= 0 || 
      endingValue <= 0 || 
      periods <= 0 ||
      isNaN(beginningValue) || 
      isNaN(endingValue) || 
      isNaN(periods)) {
    return 0;
  }
  
  const result = Math.pow(endingValue / beginningValue, 1 / periods) - 1;
  
  if (!isFinite(result) || isNaN(result)) {
    return 0;
  }
  
  return roundToDecimals(result, 4);
}

/**
 * Calculates return on investment (ROI)
 * @param currentValue - Current value of investment
 * @param initialInvestment - Initial investment amount
 * @returns ROI as a decimal (e.g., 0.25 for 25%)
 */
export function calculateROI(currentValue: number, initialInvestment: number): number {
  if (typeof currentValue !== 'number' || 
      typeof initialInvestment !== 'number' ||
      initialInvestment === 0 ||
      isNaN(currentValue) || 
      isNaN(initialInvestment)) {
    return 0;
  }
  
  const roi = safeDivide(currentValue - initialInvestment, initialInvestment);
  return roundToDecimals(roi, 4);
}

/**
 * Converts a percentage string to decimal number
 * @param percentageStr - Percentage string (e.g., '15%', '15.5%')
 * @returns Decimal number (e.g., 0.15, 0.155)
 */
export function parsePercentage(percentageStr: string): number {
  if (typeof percentageStr !== 'string') {
    return 0;
  }
  
  // Remove % symbol and any whitespace
  const cleanStr = percentageStr.replace(/%/g, '').trim();
  const parsed = parseFloat(cleanStr);
  
  if (isNaN(parsed)) {
    return 0;
  }
  
  return roundToDecimals(parsed / 100, 4);
}

/**
 * Validates if a number is a valid financial amount
 * @param value - Value to validate
 * @returns True if valid financial amount
 */
export function isValidFinancialAmount(value: any): boolean {
  return typeof value === 'number' && 
         !isNaN(value) && 
         isFinite(value) && 
         value >= 0;
}

/**
 * Sanitizes a financial input value
 * @param value - Input value to sanitize
 * @param defaultValue - Default value if sanitization fails
 * @returns Sanitized financial amount
 */
export function sanitizeFinancialInput(
  value: any, 
  defaultValue: number = 0
): number {
  if (typeof value === 'string') {
    // Remove currency symbols, commas, and other non-numeric characters except decimal point and minus
    const cleaned = value.replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(cleaned);
    
    if (!isNaN(parsed) && isFinite(parsed)) {
      return Math.max(0, parsed); // Ensure non-negative
    }
  }
  
  if (isValidFinancialAmount(value)) {
    return value as number;
  }
  
  return defaultValue;
}

/**
 * Formats a large number with appropriate suffixes (K, M, B)
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted string with suffix
 */
export function formatLargeNumber(
  value: number, 
  decimals: number = 1
): string {
  if (!isValidFinancialAmount(value)) {
    return '0';
  }
  
  const suffixes = [
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' }
  ];
  
  for (const { threshold, suffix } of suffixes) {
    if (value >= threshold) {
      const formatted = roundToDecimals(value / threshold, decimals);
      return `${formatted}${suffix}`;
    }
  }
  
  return roundToDecimals(value, decimals).toString();
}

/**
 * Calculates asset allocation percentages
 * @param assets - Array of assets with values
 * @returns Array of assets with allocation percentages
 */
export function calculateAssetAllocation(
  assets: Array<{ name: string; value: number }>
): Array<{ name: string; value: number; percentage: number }> {
  if (!Array.isArray(assets) || assets.length === 0) {
    return [];
  }
  
  const totalValue = assets.reduce((sum, asset) => {
    const value = isValidFinancialAmount(asset.value) ? asset.value : 0;
    return sum + value;
  }, 0);
  
  return assets.map(asset => {
    const value = isValidFinancialAmount(asset.value) ? asset.value : 0;
    const percentage = safeDivide(value, totalValue);
    
    return {
      name: asset.name,
      value: roundToDecimals(value),
      percentage: roundToDecimals(percentage, 4)
    };
  });
}
