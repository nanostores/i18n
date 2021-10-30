import { computed } from 'nanostores'

export function formatter(locale) {
  return computed(locale, code => {
    return {
      number(num, opts) {
        return new Intl.NumberFormat(code, opts).format(num)
      },
      time(date, opts) {
        return new Intl.DateTimeFormat(code, opts).format(date)
      }
    }
  })
}
