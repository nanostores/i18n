export function createLoadTranslations(i18n, locale, get) {
  async function loadTranslations(messages) {
    let code = locale.get()

    let translations = await get(code, [messages.component])
    if (Array.isArray(translations)) {
      translations = translations.reduce((obj, item) =>
        Object.assign(obj, item)
      )
    }

    i18n.cache[code] = { ...i18n.cache[code], translations }
    return messages.get()
  }

  return loadTranslations
}
