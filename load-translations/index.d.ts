import type { Messages, Translations } from '../create-i18n/index.js'

export interface LoadTranslations {
  <Body extends Translations>(messages: Messages<Body>): Promise<Body>
}

/**
 * Small helper to load translations to use them on the server.
 *
 * ```js
 * import { loadTranslations } from '@nanostores/i18n'
 *
 * const messages = i18n(…)
 * const t = await loadTranslations(messages)
 * ```
 *
 * @param i18n Component messages.
 * @returns Messages text.
 */
export function loadTranslations<Body extends Translations>(
  messages: Messages<Body>
): Promise<Body>
