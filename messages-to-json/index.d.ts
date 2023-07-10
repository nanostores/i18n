import type { ComponentsJSON, Messages } from '../create-i18n/index.js'

/**
 * Convert base transations to JSON.
 *
 * Useful to check translation completeness or to send base translations
 * to online translation service.
 *
 * ```js
 * import { messagesToJSON } from '@nanostores/i18n'
 *
 * const files = await glob('src/*.tsx')
 * const components = await Promise.all(files.map(file => {
 *   return (await import(file).messages)
 * }))
 * const json = messagesToJSON(...components)
 * ```
 *
 * @param components List of messages from `i18n()` calls.
 * @returns Translation JSON
 */
export function messagesToJSON(...components: Messages[]): ComponentsJSON
