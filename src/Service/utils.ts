import { endOfDay } from 'date-fns'

export function disabledDate(current: Date): boolean {
  return current && current < endOfDay(new Date())
}
