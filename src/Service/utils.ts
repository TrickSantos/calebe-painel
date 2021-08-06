import { startOfDay } from 'date-fns'

export function disabledDate(current: Date): boolean {
  return current < startOfDay(new Date())
}
