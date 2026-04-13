import { translationsLoading } from '../translations-loading/index.js'

export function createLoadTranslations(i18n) {
  async function loadTranslations(messages) {
    void messages.get()
    await translationsLoading(i18n)

    return messages.get()
  }

  return loadTranslations
}
