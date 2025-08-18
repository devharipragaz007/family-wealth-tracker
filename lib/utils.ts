import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge className strings using clsx and tailwind-merge
 * @param inputs - Class name strings or conditional classes
 * @returns Merged class name string
 */
export function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs))
}

/**
 * Safe division utility to prevent division by zero
 * @param dividend - Number to divide
 * @param divisor - Number to divide by
 * @param fallback - Fallback value if divisor is zero
 * @returns Result of division or fallback
 */
export function safeDivide(dividend: number, divisor: number, fallback: number = 0): number {
  return divisor === 0 ? fallback : dividend / divisor
}

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
