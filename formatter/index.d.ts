import type { ReadableAtom } from 'nanostores'

import type { LocaleStore } from '../locale-from/index.js'

export interface Formatter {
  number(num: number, opts?: Intl.NumberFormatOptions): string
  relativeTime(
    num: number,
    unit: Intl.RelativeTimeFormatUnit,
    opts?: Intl.RelativeTimeFormatOptions
  ): string
  time(date?: Date | number, opts?: Intl.DateTimeFormatOptions): string
}

/**
 * Create time/number formatter connected to current locale.
 *
 * See `Intl.DateTimeFormat`, `Intl.NumberFormat`
 * and `Intl.RelativeTimeFormat` for options.
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
 * export let Date = (date) => {
 *   let { time } = useStore(format)
 *   return time(date)
 * }
 * ```
 *
 * @param locale
 */
export function formatter(locale: LocaleStore): ReadableAtom<Formatter>
