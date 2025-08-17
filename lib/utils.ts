import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function for merging className values using clsx and tailwind-merge
 * This function safely combines multiple class names for UI components
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(...inputs))
}

/**
 * Safe division utility to handle division by zero
 * @param numerator - The dividend
 * @param denominator - The divisor
 * @param fallback - Value to return if division by zero
 * @returns Result of division or fallback value
 */
export function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (denominator === 0) return fallback;
  return numerator / denominator;
}

/**
 * Format a number as a percentage with specified decimal places
 * @param value - The decimal value to format (0.5 = 50%)
 * @param decimals - Number of decimal places to show
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
