import { ReadableAtom } from 'nanostores'

import { LocaleStore } from '../locale-from/index.js'

export interface Formatter {
  number: Intl.NumberFormat['format']
  time: Intl.DateTimeFormat['format']
}

/**
 * Create time/number formatter connected to current locale.
 *
 * See `Intl.DateTimeFormat` and `Intl.NumberFormat` for options.
 *
 * ```js
 * import { formatter, localeFrom } from '@nanostores/i18n'
 *
 * export const locale = localeFrom(…)
 *
 * export const format = formatter(locale)
 * ```
 *
 * ```js
 * import { useStore } from 'nanostores'
 * import { format } from '../stores/i18n.js'
 *
 * export Date = (date) => {
 *   let { time } = useStore(format)
 *   return time(date)
 * }
 * ```
 *
 * @param locale
 */
export function formatter(locale: LocaleStore): ReadableAtom<Formatter>
