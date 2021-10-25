import { ReadableAtom } from 'nanostores'

interface AutodetectOpts<Locales extends readonly string[]> {
  /**
   * Locales supported by the application.
   */
  between: Locales
  /**
   * Locale for the case when browser doesn’t support any locale from `between`.
   */
  fallback?: Locales[number]
}

/**
 *
 */
export function autodetect<Locales extends readonly string[]>(
  opts: AutodetectOpts<Locales>
): ReadableAtom<Locales[number]>
