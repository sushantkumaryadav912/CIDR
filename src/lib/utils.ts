import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRiskColor(score: number): string {
  if (score < 60) return 'text-blue-400';
  if (score < 85) return 'text-amber-400';
  return 'text-red-400';
}

export function getRiskBgColor(score: number): string {
  if (score < 60) return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  if (score < 85) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  return 'bg-red-500/10 text-red-400 border-red-500/20';
}

export function formatTimestamp(date: string): string {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatISOTimestamp(date: string): string {
  return new Date(date).toISOString();
}

export async function simulateDelay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
