import { startOfDay } from 'date-fns'

export function disabledDate(current: Date): boolean {
  return current < startOfDay(new Date())
}

export function isImage(url: string): boolean {
  const reg = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/
  return reg.test(url)
}
