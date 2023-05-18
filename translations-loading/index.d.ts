import type { I18n } from '../create-i18n/index.js'

/**
 * Return a promise until current translation loading will be finished.
 *
 * ```js
 * import { translationsLoading } from '@nanostores/i18n'
 *
 * await translationsLoading(i18n)
 * ```
 *
 * @param i18n I18n object.
 */
export function translationsLoading(i18n: I18n): Promise<void>
